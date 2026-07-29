import 'package:flutter/material.dart';


class DashboardScreen extends StatelessWidget {

  const DashboardScreen({
    Key? key,
  }) : super(key: key);



  final Color darkBgColor =
      const Color(0xFF121214);

  final Color cardBgColor =
      const Color(0xFF1E1E24);

  final Color neonPurple =
      const Color(0xFFBB86FC);

  final Color neonCyan =
      const Color(0xFF03DAC6);

  final Color neonGreen =
      const Color(0xFF00FF66);

  final Color neonOrange =
      const Color(0xFFFF9800);

  final Color textSecondary =
      const Color(0xFF94A3B8);



  @override
  Widget build(BuildContext context) {


    return Scaffold(

      backgroundColor:
          darkBgColor,


      appBar: AppBar(

        backgroundColor:
            darkBgColor,

        elevation:
            0,


        title: Row(

          children: [

            Container(

              padding:
                  const EdgeInsets.all(8),

              decoration:
                  BoxDecoration(

                    color:
                        neonPurple,

                    borderRadius:
                        BorderRadius.circular(12),

                  ),

              child:
                  const Icon(

                    Icons.sports_soccer,

                    color:
                        Colors.black,

                  ),

            ),


            const SizedBox(width:12),


            const Text(

              "BLHub",

              style:
                  TextStyle(

                    fontWeight:
                        FontWeight.bold,

                    color:
                        Colors.white,

                    fontSize:
                        24,

                  ),

            ),

          ],

        ),



        actions: [

          IconButton(

            icon:
                const Icon(
                  Icons.logout,
                  color:
                      Colors.redAccent,
                ),

            onPressed: (){

              Navigator.pushReplacementNamed(
                context,
                '/',
              );

            },

          )

        ],

      ),




      body: Padding(

        padding:
            const EdgeInsets.all(20),


        child: Column(


          crossAxisAlignment:
              CrossAxisAlignment.start,


          children: [


            const Text(

              "Olá, Administrador 👋",

              style:
                  TextStyle(

                    color:
                        Colors.white,

                    fontSize:
                        28,

                    fontWeight:
                        FontWeight.bold,

                  ),

            ),



            Text(

              "Central de gestão BL Mantos",

              style:
                  TextStyle(

                    color:
                        textSecondary,

                  ),

            ),



            const SizedBox(height:30),




            Expanded(

              child:
                  GridView.count(


                    crossAxisCount:
                        2,


                    crossAxisSpacing:
                        18,


                    mainAxisSpacing:
                        18,



                    children: [



                      _menuCard(

                        context,

                        "Estoque",

                        Icons.inventory_2,

                        neonPurple,

                        '/products',

                      ),



                      _menuCard(

                        context,

                        "Vendas",

                        Icons.receipt_long,

                        neonGreen,

                        '/sales',

                      ),




                      _menuCard(

                        context,

                        "Clientes",

                        Icons.people,

                        neonOrange,

                        '',

                      ),




                      _menuCard(

                        context,

                        "Compras",

                        Icons.shopping_cart,

                        neonCyan,

                        '',

                      ),



                    ],


                  ),

            )



          ],


        ),


      ),


    );


  }




  Widget _menuCard(

    BuildContext context,

    String title,

    IconData icon,

    Color color,

    String route,

  ){

    return InkWell(


      borderRadius:
          BorderRadius.circular(22),


      onTap: (){


        if(route.isNotEmpty){

          Navigator.pushNamed(
            context,
            route,
          );

        }


      },



      child: Container(


        decoration:
            BoxDecoration(


              color:
                  cardBgColor,


              borderRadius:
                  BorderRadius.circular(22),



              border:
                  Border.all(

                    color:
                        color.withOpacity(.35),

                  ),



              boxShadow: [

                BoxShadow(

                  color:
                      color.withOpacity(.15),

                  blurRadius:
                      15,

                  spreadRadius:
                      2,

                )

              ],


            ),



        child:
            Column(

              mainAxisAlignment:
                  MainAxisAlignment.center,


              children: [


                Container(

                  padding:
                      const EdgeInsets.all(15),

                  decoration:
                      BoxDecoration(

                        color:
                            color.withOpacity(.15),

                        borderRadius:
                            BorderRadius.circular(18),

                      ),

                  child:
                      Icon(

                        icon,

                        size:
                            42,

                        color:
                            color,

                      ),

                ),



                const SizedBox(height:15),



                Text(

                  title,

                  style:
                      const TextStyle(

                        color:
                            Colors.white,

                        fontSize:
                            18,

                        fontWeight:
                            FontWeight.bold,

                      ),

                )

              ],


            ),


      ),


    );

  }

}