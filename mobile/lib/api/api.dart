import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/item.dart';

class Api {

  static const url = "http://192.168.101.8:8000";

  static Future<List<Item>> getItems() async {

    final response =
        await http.get(Uri.parse("$url/api/items"));

    final json = jsonDecode(response.body);

    final List data = json["data"];

    return data.map((e) => Item.fromJson(e)).toList();
  }
}