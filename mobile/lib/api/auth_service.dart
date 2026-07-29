import 'package:dio/dio.dart';

import 'api_client.dart';
import 'endpoints.dart';

class AuthService {
  static Future<bool> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await ApiClient.dio.post(
        Endpoints.login,
        data: {
          "usr": username,
          "pwd": password,
        },
      );

      return response.statusCode == 200;
    } on DioException {
      return false;
    }
  }

  static Future<void> logout() async {
    await ApiClient.dio.post(Endpoints.logout);
  }
}