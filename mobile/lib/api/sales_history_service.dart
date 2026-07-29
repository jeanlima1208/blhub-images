import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

import 'api_client.dart';
import '../models/sales_invoice.dart';


class SalesHistoryService {


  static Future<List<SalesInvoice>> getSales() async {


    try {


      debugPrint(
        "BUSCANDO VENDAS ERPNext",
      );



      final response =
          await ApiClient.dio.get(


        "/api/resource/Sales Invoice",


        queryParameters: {


          "fields":
          '["name","customer","posting_date","grand_total","outstanding_amount","status","docstatus"]',


          "order_by":
          "creation desc",


          "limit_page_length":
          100,


        },


      );



      debugPrint(
        "STATUS ERP: ${response.statusCode}",
      );



      debugPrint(
        "RESPOSTA ERP: ${response.data}",
      );




      final List data =
          response.data["data"];



      return data.map((e){


        return SalesInvoice.fromJson(e);


      }).toList();




    }


    on DioException catch(e){

  debugPrint("====================");
  debugPrint("TIPO ERRO:");
  debugPrint(e.type.toString());

  debugPrint("MENSAGEM:");
  debugPrint(e.message);

  debugPrint("URL:");
  debugPrint(e.requestOptions.uri.toString());

  debugPrint("HEADERS:");
  debugPrint(e.requestOptions.headers.toString());

  debugPrint("====================");

  return [];

}


    catch(e){


      debugPrint(
        "ERRO GERAL:"
      );


      debugPrint(
        e.toString(),
      );


      return [];


    }


  }


}