import '../models/item.dart';
import 'api_client.dart';

class ItemService {
  static Future<List<Item>> getItems() async {
    final response = await ApiClient.dio.get(
      "/api/resource/Item",
      queryParameters: {
        "fields":
            '["name","item_name","item_group","image"]',
        "limit_page_length": 100,
      },
    );

    final data = response.data["data"] as List;

    return data.map((e) => Item.fromJson(e)).toList();
  }
}
