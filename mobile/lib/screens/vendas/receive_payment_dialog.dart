import 'package:flutter/material.dart';

import '../../models/sales_invoice.dart';
import '../../api/api_client.dart';


class ReceivePaymentDialog extends StatefulWidget {

  final SalesInvoice sale;

  const ReceivePaymentDialog({
    super.key,
    required this.sale,
  });


  @override
  State<ReceivePaymentDialog> createState() =>
      _ReceivePaymentDialogState();

}



class _ReceivePaymentDialogState
    extends State<ReceivePaymentDialog> {


  late TextEditingController valueController;


  String paymentMethod = "PIX";


  bool loading = false;



  @override
  void initState() {

    super.initState();


    valueController =
        TextEditingController(
          text: widget.sale.outstandingAmount
              .toStringAsFixed(2),
        );

  }





  Future<void> createPayment() async {


    setState(() {

      loading = true;

    });



    try {


      final double value =
          double.parse(
            valueController.text
                .replaceAll(",", "."),
          );



      // =========================
      // CRIAR PAYMENT ENTRY
      // =========================


      final response =
          await ApiClient.dio.post(

        "/api/resource/Payment Entry",

        data: {


          "doctype":
              "Payment Entry",


          "payment_type":
              "Receive",


          "party_type":
              "Customer",


          "party":
              widget.sale.customer,



          "paid_amount":
              value,


          "received_amount":
              value,



          "paid_from":
              "Clientes - BM",



          "paid_to":
              "NEON - BM",
           
              "remarks":
    "Recebimento $paymentMethod pelo BLHub",



          "reference_no":
              "BLHUB-${DateTime.now().millisecondsSinceEpoch}",



          "reference_date":
              DateTime.now()
                  .toIso8601String()
                  .substring(0,10),



          "references":[


            {


              "reference_doctype":
                  "Sales Invoice",



              "reference_name":
                  widget.sale.name,



              "allocated_amount":
                  value,


            }


          ]

        },

      );



      final paymentName =
          response.data["data"]["name"];




      // =========================
      // BUSCAR PAYMENT
      // =========================


      final payment =
          await ApiClient.dio.get(

            "/api/resource/Payment Entry/$paymentName",

          );



      final paymentDoc =
          payment.data["data"];




      // =========================
      // SUBMIT
      // =========================


      await ApiClient.dio.post(

        "/api/method/frappe.client.submit",

        data: {

          "doc":
              paymentDoc,

        },

      );



      if(mounted){

        Navigator.pop(
          context,
          true,
        );

      }



    }catch(e){


      debugPrint(
        e.toString(),
      );


    }



    setState(() {

      loading = false;

    });


  }





  @override
  Widget build(BuildContext context) {


    return AlertDialog(


      title:
          const Text(
            "Receber Pagamento",
          ),



      content: Column(

        mainAxisSize:
            MainAxisSize.min,


        children: [


          Text(
            widget.sale.customer,
          ),


          const SizedBox(
            height: 10,
          ),



          Text(
            "Saldo: R\$ ${widget.sale.outstandingAmount.toStringAsFixed(2)}",
          ),



          const SizedBox(
            height: 15,
          ),



          TextField(

            controller:
                valueController,


            keyboardType:
                TextInputType.number,


            decoration:
                const InputDecoration(

                  labelText:
                      "Valor recebido",

                  border:
                      OutlineInputBorder(),

                ),

          ),



          const SizedBox(
            height: 15,
          ),



          DropdownButton<String>(

            value:
                paymentMethod,


            isExpanded:
                true,


            items: const [


              DropdownMenuItem(

                value:
                    "PIX",

                child:
                    Text("PIX"),

              ),



              DropdownMenuItem(

                value:
                    "DINHEIRO",

                child:
                    Text("Dinheiro"),

              ),



              DropdownMenuItem(

                value:
                    "CARTAO",

                child:
                    Text("Cartão"),

              ),


            ],


            onChanged: (value){


              setState(() {

                paymentMethod =
                    value!;

              });


            },


          ),


        ],

      ),



      actions: [


        TextButton(

          onPressed:
              loading
              ? null
              : () =>
                  Navigator.pop(context),

          child:
              const Text(
                "Cancelar",
              ),

        ),




        ElevatedButton(

          onPressed:
              loading
              ? null
              : createPayment,


          child:
              loading

              ? const CircularProgressIndicator()

              : const Text(
                  "Confirmar",
                ),

        ),


      ],


    );


  }


}