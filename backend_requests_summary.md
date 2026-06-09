# Backend Geliştirici İçin Yeni Endpoint ve Düzenleme Talepleri

Bu doküman, frontend (arayüz) entegrasyonu sırasında tespit edilen eksik endpoint'leri, veri yapılarındaki genişletme taleplerini ve yeni özellikleri içermektedir. Tüm değişiklikler mevcut swagger dokümantasyonuna (`API_DOCUMENTATION.md`) ek olarak talep edilmektedir.

## 1. Dashboard (Panel) İhtiyaçları

### 1.1. Bekleyen Değerlendirmeler (Pending Reviews)
- **Talep**: Dashboard üzerindeki "Bekleyen Değerlendirmeler" listesini beslemek için `GET /api/v1/company/dashboard/pending-review` endpointine ihtiyaç vardır.

## 2. İlan, Workshop ve Hediye Kiti Yönetimi

### 2.1. İlan ve Workshop Kategori Filtrelemesi
- **Kategori Listesi**: Kategori seçimi için dinamik liste dönen `GET /api/v1/Categories/list` endpointine ihtiyaç vardır.
- **Filtreleme**: İlan (Advertisement) ve Workshop listeleme `GET` endpoint'lerine, filtreleme yapılabilmesi için `category` query parametresi eklenmelidir.

### 2.2. İlanlar İçin Silme İşlemi
- **Talep**: Yanlış açılan veya iptal edilmek istenen ilan/workshopların silinebilmesi için `DELETE /api/v1/Advertisements/{id}` ve `DELETE /api/v1/Workshops/{id}` endpointlerinin eklenmesi.

### 2.3. Birden Fazla İçerik Formatı Seçimi
- **Talep**: İlan oluşturma isteği (`POST /api/v1/Advertisements`) atılırken "İçerik Formatı" için sadece tekil (örn. "Reels") değil, çoklu seçim yapılabilmesi gerekmektedir. Payload içerisindeki alan `string[]` (dizi) olarak güncellenmelidir (örn: `["Reels", "Story"]`).

### 2.4. Hediye Kiti Geçerlilik Süresi
- **Talep**: Hediye Kiti (Gift Kit) oluştururken geçerlilik süresinin (örn: son kullanma tarihi) kaydedilebilmesi için ilgili modele `expirationDate` veya `validityPeriod` parametresi eklenmelidir.

## 3. Başvurularım ve Projelerim (Kritik Ortak Yapı)

**Durum**: 
1. Başvurularım sayfasındaki üst tabları (ilanları) dinamik olarak çizebilmemiz için aktif ilanların sadece özet bilgilerine ihtiyacımız var.
2. "Projelerim / Kampanyalarım" sayfası için arayüzde hiçbir endpoint bulunmuyor.

**Çözüm**: Aktif ilan özetlerini ve projeleri (tamamlanmış ilanlar) tek bir endpoint üzerinden, filtrelerle çekmek en sağlıklı yöntem olacaktır.

### Önerilen Endpoint: `GET /api/v1/Advertisements/projects-list`

**Query Parametreleri:**
- `status` (String) - `active` (Başvurularım tabları için) veya `completed` (Projelerim sayfası için) 
- `type` (String) - İlan tipi kısıtı istenirse (opsiyonel)

**Örnek JSON Yanıtı (Paginated Wrapper Formatına Uygun):**
```json
{
  "success": true,
  "message": "Projeler başarıyla getirildi",
  "data": {
    "items": [
      {
        "id": "adv-123",
        "title": "Soiree Menü Reklamı",
        "type": "barter",
        "status": "active",
        "applicationCount": 15,
        "createDate": "2026-06-01T10:00:00Z"
      },
      {
        "id": "adv-124",
        "title": "Yaz Sezonu Kapanış Partisi",
        "type": "barter",
        "status": "completed",
        "applicationCount": 42,
        "createDate": "2025-09-01T09:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 2,
      "totalPages": 1
    }
  }
}
```

## 4. Genel Formlar ve Ayarlar (Statik Verilerin Dinamikleşmesi)

### 4.1. İl, İlçe ve Sektör Listelerinin Dinamikleştirilmesi
Arayüzde şu an sabit dosyalardan okunan form elemanlarının veritabanı kontrollü olması için listeleme endpointleri:
- **İl ve İlçeler**: `GET /api/v1/Locations/cities` (Tercihen şehre tıklandığında ilçeleri dönen hiyerarşik veya parametreli bir yapı)
- **Sektörler**: `GET /api/v1/company/sectors`

### 4.2. Talep ve Destek Yönetimi Güncellemeleri
- **Talep**: Oluşturulmuş bir şirket destek kaydının (company/support) iptal edilebilmesi veya düzeltilebilmesi için:
  - Silme: `DELETE /api/v1/company/support/{id}` 
  - Düzenleme: `PUT /api/v1/company/support/{id}`
endpoint'lerine ihtiyaç vardır.
