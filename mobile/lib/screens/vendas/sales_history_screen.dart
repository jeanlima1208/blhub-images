import 'package:flutter/material.dart';

import '../../api/sales_history_service.dart';
import '../../models/sales_invoice.dart';
import 'widgets/sale_card.dart';
import 'receive_payment_dialog.dart';


class SalesHistoryScreen extends StatefulWidget {

  const SalesHistoryScreen({
    super.key,
  });


  @override
  State<SalesHistoryScreen> createState() =>
      _SalesHistoryScreenState();

}



class _SalesHistoryScreenState
    extends State<SalesHistoryScreen> {


  bool loading = true;


  List<SalesInvoice> sales = [];


  List<SalesInvoice> filtered = [];



  final TextEditingController searchController =
      TextEditingController();



  String filter = "TODOS";



  @override
  void initState() {

    super.initState();

    loadSales();

  }




  Future<void> loadSales() async {


    setState(() {

      loading = true;

    });



    sales =
        await SalesHistoryService.getSales();



    applyFilters();



    setState(() {

      loading = false;

    });


  }





  void applyFilters() {


    final search =
        searchController.text
            .trim()
            .toLowerCase();



    filtered =
        sales.where((sale) {


      final matchSearch =

          sale.customer
              .toLowerCase()
              .contains(search)

          ||

          sale.name
              .toLowerCase()
              .contains(search);



      bool matchStatus = true;



      switch(filter){


        case "PAGO":

          matchStatus =
              sale.isPaid;

          break;



        case "PARCIAL":

          matchStatus =
              sale.isPartial;

          break;



        case "ABERTO":

          matchStatus =
              sale.isOpen;

          break;



        default:

          matchStatus = true;

      }



      return matchSearch && matchStatus;


    }).toList();



    setState(() {});


  }






  @override
  Widget build(BuildContext context) {


    return Scaffold(


      appBar: AppBar(

        title:
            const Text(
              "Histórico de Vendas",
            ),

      ),




      body: loading


          ? const Center(

              child:
                  CircularProgressIndicator(),

            )



          :

          Column(

            children: [



              Padding(

                padding:
                    const EdgeInsets.all(12),


                child: TextField(

                  controller:
                      searchController,


                  decoration:
                      const InputDecoration(

                        hintText:
                            "Cliente ou fatura",

                        prefixIcon:
                            Icon(Icons.search),

                        border:
                            OutlineInputBorder(),

                      ),



                  onChanged: (value){

                    applyFilters();

                  },


                ),

              ),




              SizedBox(

                height:50,


                child: ListView(

                  scrollDirection:
                      Axis.horizontal,


                  padding:
                      const EdgeInsets.symmetric(
                        horizontal:12,
                      ),


                  children:


                  [

                    "TODOS",
                    "ABERTO",
                    "PARCIAL",
                    "PAGO",

                  ]

                  .map((item){


                    return Padding(

                      padding:
                          const EdgeInsets.only(
                            right:8,
                          ),


                      child: ChoiceChip(


                        label:
                            Text(item),



                        selected:
                            filter == item,



                        onSelected: (_) {


                          setState(() {

                            filter =
                                item;

                          });



                          applyFilters();


                        },


                      ),

                    );


                  })

                  .toList(),


                ),

              ),




              Expanded(


                child:
                    RefreshIndicator(


                  onRefresh:
                      loadSales,



                  child:
                      ListView.builder(


                    itemCount:
                        filtered.length,



                    itemBuilder:
                        (context,index){



                      final sale =
                          filtered[index];



                      return SaleCard(

                        sale:
                            sale,



                        onTap: (){


                          debugPrint(
                            sale.name,
                          );


                        },



                        onReceive: () async {



                          final result =
                              await showDialog(


                            context:
                                context,


                            builder: (_)=>


                                ReceivePaymentDialog(

                                  sale:
                                      sale,

                                ),


                          );



                          if(result == true){

                            loadSales();

                          }


                        },


                      );


                    },


                  ),

                ),


              ),



            ],

          ),


    );


  }


}