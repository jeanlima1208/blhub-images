import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import '../models/item.dart';

class ItemService {
  static const String baseUrl = 'http://163.176.237.176';

  static const String token =
      'token 7844dd383253178:038b42a36383f66';

  static Map<String, String> get headers => {
        'Authorization': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };


  // BUSCA TEMPLATES
  static Future<List<Item>> getTemplates() async {
  try {

    final itemUri = Uri.parse(
      '$baseUrl/api/resource/Item'
    ).replace(
      queryParameters: {

        'filters': jsonEncode([
          ["has_variants","=",1]
        ]),

        'fields': jsonEncode([
          "name",
          "item_code",
          "item_name",
          "item_group",
          "image"
        ]),

        'limit_page_length':'1000'

      },
    );


    final itemResponse = await http.get(
      itemUri,
      headers: headers,
    );


    if(itemResponse.statusCode != 200){
      throw Exception(itemResponse.body);
    }


    final itemData =
        jsonDecode(itemResponse.body)["data"] ?? [];


    List<Item> parents =
        itemData.map<Item>(
          (json)=>Item.fromJson(json)
        ).toList();



    // BUSCA ESTOQUE DE TODAS AS VARIANTS

    final binUri = Uri.parse(
      '$baseUrl/api/resource/Bin'
    ).replace(
      queryParameters: {

        'fields':jsonEncode([
          "item_code",
          "actual_qty"
        ]),

        'limit_page_length':'5000'

      },
    );


    final binResponse = await http.get(
      binUri,
      headers: headers,
    );


    final binData =
        jsonDecode(binResponse.body)["data"] ?? [];



    for(var parent in parents){

      int total = 0;
      List<String> sizes = [];


      for(var bin in binData){

        String code =
            bin["item_code"] ?? "";


        double qty =
            (bin["actual_qty"] as num?)
            ?.toDouble() ?? 0;



        if(
          code.toLowerCase()
          .startsWith(
            "${parent.code.toLowerCase()}-"
          )
        ){

          total += qty.toInt();


          String size =
              code.split("-").last.toUpperCase();


          if(qty > 0){
            sizes.add(size);
          }else{
            sizes.add("$size|ZERADO");
          }

        }

      }


      parent.stock = total;

      parent.availableSizes =
          sizes.toSet().toList();

    }


    return parents;


  }catch(e, stack){

    print("ERRO TEMPLATES: $e");
    print(stack);

    return [];

  }
}



  // BUSCA VARIANTES
 static Future<List<Item>> getVariantsOf(String parentCode) async {
  try {
    final uri = Uri.parse(
      '$baseUrl/api/resource/Item',
    ).replace(
      queryParameters: {
        'filters': jsonEncode([
          ['variant_of', '=', parentCode]
        ]),
        'fields': jsonEncode([
          'name',
          'item_code',
          'item_name',
          'item_group',
          'image'
        ]),
        'limit_page_length': '1000'
      },
    );

    final response = await http.get(
      uri,
      headers: headers,
    );

    if (response.statusCode != 200) {
      throw Exception(response.body);
    }

    final data = jsonDecode(response.body)['data'] ?? [];

    List<Item> variants =
        data.map<Item>((x) => Item.fromJson(x)).toList();

    final prices = await getAllPrices();

    for (var item in variants) {
      item.stock = await getStockOf(item.code);
      item.price = prices[item.code] ?? 0.0;
    }

    return variants;
  } catch (e) {
    print("ERRO VARIANTES: $e");
    return [];
  }
}

// PREÇOS
static Future<Map<String, double>> getAllPrices() async {
  try {
    final uri = Uri.parse(
      '$baseUrl/api/resource/Item Price',
    ).replace(
      queryParameters: {
        'filters': jsonEncode([
          ['price_list', '=', 'Standard Selling']
        ]),
        'fields': jsonEncode([
          'item_code',
          'price_list',
          'price_list_rate'
        ]),
        'limit_page_length': '5000',
      },
    );

    final response = await http.get(
      uri,
      headers: headers,
    );

    if (response.statusCode != 200) {
      print(response.body);
      return {};
    }

    final data = jsonDecode(response.body)['data'] ?? [];

    Map<String, double> prices = {};

    for (var p in data) {
      prices[p['item_code']] =
          (p['price_list_rate'] as num?)?.toDouble() ?? 0.0;
    }

    return prices;
  } catch (e) {
    print("ERRO PREÇOS: $e");
    return {};
  }
}


  // ESTOQUE
  static Future<int> getStockOf(String itemCode) async {

    try{


      final uri =
          Uri.parse(
            '$baseUrl/api/resource/Bin'
          ).replace(

            queryParameters: {

              'filters': jsonEncode([
                ["item_code","=",itemCode]
              ]),

              'fields':jsonEncode([
                "actual_qty"
              ])

            }

          );



      final response =
          await http.get(
            uri,
            headers: headers
          );


      if(response.statusCode !=200){
        return 0;
      }


      final data =
          jsonDecode(response.body)["data"] ?? [];


      if(data.isEmpty){
        return 0;
      }


      return
        (data[0]["actual_qty"] as num)
          .toInt();



    }catch(e){

      return 0;

    }

  }





  // UPLOAD IMAGEM
static Future<void> uploadImage(
  String itemCode,
  Uint8List bytes,
  String fileName,
) async {

  final request = http.MultipartRequest(
    'POST',
    Uri.parse('http://192.168.101.114:8000/upload-image'),
  );

  request.files.add(
    http.MultipartFile.fromBytes(
      'file',
      bytes,
      filename: fileName,
    ),
  );

  request.fields['item_code'] = itemCode;

  final response = await request.send();

  final body = await response.stream.bytesToString();

  if (response.statusCode != 200) {
    throw Exception(body);
  }

  print("UPLOAD OK");
  print(body);
}




  // REMOVE IMAGEM
  static Future<void> removeImage(String itemCode) async {

    await http.put(

      Uri.parse(
        '$baseUrl/api/resource/Item/$itemCode'
      ),

      headers:headers,

      body:jsonEncode({

        "image":null

      })

    );

  }

}