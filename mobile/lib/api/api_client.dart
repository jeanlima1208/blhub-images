import 'dart:io';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';

import 'endpoints.dart';

class ApiClient {
  ApiClient._();

  static late final CookieJar cookieJar;
  
  // CORRIGIDO: Agora com as aspas para o Dart aceitar como texto (String)
  static const String apiKey = "7844dd383253178";
  static const String apiSecret = "41770aca5443534";

  static final Dio dio = Dio(
    BaseOptions(
      baseUrl: Endpoints.baseUrl,
      connectTimeout: const Duration(seconds: 20),
      receiveTimeout: const Duration(seconds: 20),
      headers: {
        "Accept": "application/json",
        "Authorization": "token $apiKey:$apiSecret",
      },
    ),
  );

  static Future<void> init() async {
    if (kIsWeb) {
      cookieJar = CookieJar();
    } else {
      final Directory appDocDir = await getApplicationDocumentsDirectory();
      final String cookiePath = '${appDocDir.path}/.cookies/';
      cookieJar = PersistCookieJar(
        storage: FileStorage(cookiePath),
      );
      
      dio.interceptors.add(CookieManager(cookieJar));
    }
  }
}