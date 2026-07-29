import 'package:flutter/material.dart';

import '../../models/sales_invoice.dart';


class SaleDetailsScreen extends StatelessWidget {

  final SalesInvoice sale;


  const SaleDetailsScreen({
    super.key,
    required this.sale,
  });



  @override
  Widget build(BuildContext context) {


    return Scaffold(


      appBar: AppBar(

        title:
            const Text(
              "Detalhes da Venda",
            ),

      ),



      body: Padding(

        padding:
            const EdgeInsets.all(16),


        child: Column(

          crossAxisAlignment:
              CrossAxisAlignment.start,


          children: [


            Text(

              sale.name,

              style:
                  const TextStyle(
                    fontSize: 20,
                    fontWeight:
                        FontWeight.bold,
                  ),

            ),



            const SizedBox(
              height: 15,
            ),



            Text(
              "Cliente: ${sale.customer}",
            ),



            const SizedBox(
              height: 10,
            ),



            Text(
              "Data: ${sale.postingDate.day}/${sale.postingDate.month}/${sale.postingDate.year}",
            ),



            const Divider(),



            Text(
              "Total: R\$ ${sale.grandTotal.toStringAsFixed(2)}",
            ),



            Text(
              "Pago: R\$ ${sale.paidAmount.toStringAsFixed(2)}",
            ),



            Text(
              "Aberto: R\$ ${sale.outstandingAmount.toStringAsFixed(2)}",
            ),



            const SizedBox(
              height: 20,
            ),



            Text(

              sale.statusLabel,

              style:
                  TextStyle(

                    fontSize: 18,

                    fontWeight:
                        FontWeight.bold,

                    color:
                        sale.isPaid
                        ? Colors.green
                        : sale.isPartial
                        ? Colors.orange
                        : Colors.red,

                  ),

            ),


          ],


        ),


      ),


    );


  }


}