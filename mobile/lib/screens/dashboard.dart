import 'package:flutter/material.dart';
import '../widgets/menu_card.dart';


class DashboardPage extends StatelessWidget {

  const DashboardPage({
    super.key,
  });


  @override
  Widget build(BuildContext context) {


    return Scaffold(


      backgroundColor:
          const Color(0xFF0F1115),


      appBar: AppBar(


        backgroundColor:
            const Color(0xFF0F1115),


        elevation: 0,


        title: Row(

          children: [


            Container(

              width: 42,

              height: 42,

              decoration: BoxDecoration(

                borderRadius:
                    BorderRadius.circular(12),

                gradient:
                    const LinearGradient(

                      colors: [

                        Color(0xFFFFEA00),

                        Color(0xFFFF9800),

                      ],

                    ),

              ),

              child: const Icon(

                Icons.sports_soccer,

                color: Colors.black,

              ),

            ),


            const SizedBox(width: 12),


            const Text(

              "BLHub",

              style: TextStyle(

                fontSize: 26,

                fontWeight:
                    FontWeight.bold,

                color:
                    Color(0xFFFFEA00),

              ),

            ),

          ],

        ),

        centerTitle: false,

      ),




      body: Padding(


        padding:
            const EdgeInsets.all(20),


        child: Column(


          crossAxisAlignment:
              CrossAxisAlignment.start,


          children: [



            const Text(

              "Bom dia 👋",

              style: TextStyle(

                color: Colors.white,

                fontSize: 32,

                fontWeight:
                    FontWeight.bold,

              ),

            ),



            const SizedBox(height: 6),



            const Text(

              "Gestão completa da BL Mantos",

              style: TextStyle(

                color:
                    Color(0xFF94A3B8),

                fontSize: 17,

              ),

            ),




            const SizedBox(height:25),




            Container(

              decoration: BoxDecoration(

                color:
                    const Color(0xFF161920),

                borderRadius:
                    BorderRadius.circular(18),

              ),

              child: const TextField(

                style:
                    TextStyle(
                      color: Colors.white,
                    ),

                decoration: InputDecoration(

                  hintText:
                      "Pesquisar módulo ou produto",

                  hintStyle:
                      TextStyle(
                        color:
                            Color(0xFF64748B),
                      ),

                  prefixIcon:
                      Icon(

                        Icons.search,

                        color:
                            Color(0xFFFFEA00),

                      ),

                  border:
                      InputBorder.none,

                  contentPadding:
                      EdgeInsets.all(18),

                ),

              ),

            ),




            const SizedBox(height:30),




            const Text(

              "Módulos",

              style: TextStyle(

                color: Colors.white,

                fontSize: 22,

                fontWeight:
                    FontWeight.bold,

              ),

            ),




            const SizedBox(height:15),




            Expanded(


              child:
              GridView.count(


                crossAxisCount: 2,


                crossAxisSpacing: 18,


                mainAxisSpacing: 18,



                children: const [



                  MenuCard(

                    icon:
                        Icons.inventory_2,

                    title:
                        "Estoque",

                    color:
                        Colors.blue,

                  ),



                  MenuCard(

                    icon:
                        Icons.receipt_long,

                    title:
                        "Vendas",

                    color:
                        Colors.green,

                  ),




                  MenuCard(

                    icon:
                        Icons.groups,

                    title:
                        "Clientes",

                    color:
                        Colors.orange,

                  ),




                  MenuCard(

                    icon:
                        Icons.shopping_bag,

                    title:
                        "Compras",

                    color:
                        Colors.purple,

                  ),




                ],


              ),


            ),



          ],


        ),


      ),


    );


  }


}