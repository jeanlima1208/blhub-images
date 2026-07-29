import 'package:flutter/material.dart';
import '../../api/customer_service.dart';


class CustomerCreateScreen extends StatefulWidget {

  const CustomerCreateScreen({super.key});

  @override
  State<CustomerCreateScreen> createState() =>
      _CustomerCreateScreenState();

}


class _CustomerCreateScreenState
    extends State<CustomerCreateScreen> {


  final nameController = TextEditingController();


  bool loading = false;


  Future<void> save() async {

    if(nameController.text.isEmpty) return;


    setState(() {
      loading = true;
    });


    final customer = await CustomerService.createCustomer(
      nameController.text,
    );


    setState(() {
      loading = false;
    });


    if(customer != null){

      Navigator.pop(
        context,
        customer,
      );

    }

  }



  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: const Text("Novo Cliente"),
      ),


      body: Padding(

        padding: const EdgeInsets.all(16),

        child: Column(

          children: [


            TextField(

              controller: nameController,

              decoration: const InputDecoration(
                labelText: "Nome do cliente",
              ),

            ),


            const SizedBox(height:20),


            ElevatedButton(

              onPressed: loading ? null : save,

              child: loading
                  ? const CircularProgressIndicator()
                  : const Text("Salvar"),

            )


          ],

        ),

      ),

    );

  }

}