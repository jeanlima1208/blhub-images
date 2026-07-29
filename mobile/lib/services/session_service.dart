import '../../api/api_client.dart';
import '../../api/endpoints.dart';

class SessionService {
  // Função que checa se o usuário está logado de verdade olhando os cookies persistidos
  static Future<bool> isLogged() async {
    try {
      final Uri uri = Uri.parse(Endpoints.baseUrl);
      // Busca os cookies salvos para o endereço do seu ERPNext
      final cookies = await ApiClient.cookieJar.loadForRequest(uri);
      
      // Procura se existe o cookie 'sid' (Session ID) e se ele não está vazio
      final hasSid = cookies.any((cookie) => cookie.name == 'sid' && cookie.value.isNotEmpty);
      
      return hasSid;
    } catch (_) {
      return false; // Se der qualquer erro, assume que não está logado
    }
  }
}