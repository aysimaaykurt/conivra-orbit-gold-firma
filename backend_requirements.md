# Backend API Güncelleme Talepleri

## 1. Projeler / Kampanyalar Listesi (Lokasyon Bilgisi)

**Endpoint URL:** `GET /Advertisements/projects-list`

**Eklenecek Parametreler (Response Body):**
- `city` (string) - Örn: "İstanbul"
- `district` (string) - Örn: "Kadıköy" VEYA doğrudan `location` (string) - Örn: "İstanbul / Kadıköy"

**Kullanım Amacı:** 
Projelerim sayfasındaki (bekleyen, devam eden, tamamlanan) proje kartlarının sağ alt kısmında yer alan 4'lü bilgi kutucuğunda projeye ait "Lokasyon" bilgisinin gösterilmesi için kullanılacaktır. Mevcut durumda bu veri gelmediği için kartlarda "-" (tire) işareti olarak gösterilmektedir.
