import 'package:dio/dio.dart';
import 'api_client.dart';


class CustomerService {


  static Future<List<String>> getCustomers() async {

    try {

      final response = await ApiClient.dio.get(

        "/api/resource/Customer",

        queryParameters: {

          "fields": '["name","customer_name"]',

          "limit_page_length": 500,

          "order_by": "customer_name asc",

        },

      );


      final List data = response.data["data"];


      return data
          .map((e) => (e["customer_name"] ?? e["name"]).toString())
          .toList();


    } on DioException catch (e) {

      print(e.response?.data);

      return [];

    }

  }



  static Future<String?> createCustomer(String name) async {


    try {


      final response = await ApiClient.dio.post(


        "/api/resource/Customer",


        data: {


          "customer_name": name,


          "customer_type": "Individual",


        },


      );



      return response.data["data"]["name"];



    } on DioException catch(e) {


      print(e.response?.data);

      return null;


    }


  }


}