# Sistem Deteksi Pneumonia Berbasis CNN 

## Deskripsi Projek
Pneumonia menjadi salah satu penyakit mematikan yang terus mengalami peningkatan kasus di Indonesia. Data menunjukkan terjadi lonjakan kasus pneumonia tiga kali lipat pada tahun 2024 dibandingkan tahun 2023. Peningkatan ini mencerminkan lemahnya sistem deteksi dini penyakit, yang diperburuk oleh kurangnya jumlah dan pemerataan dokter spesialis paru. Oleh karena itu, proyek ini bertujuan mengembangkan sistem prediksi penyakit pneumonia menggunakan algoritma machine learning berbasis analisis gambar X-ray untuk membantu proses klasifikasi penyakit pneumonia secara cepat dan akurat sehingga dapat membantu dalam mempercepat diagnosis dan penanganan lanjut pneumonia. Pernyataan penelitian yang diangkat dalam proyek ini meliputi: (1) bagaimana teknik optimalisasi algoritma machine learning dalam mengklasifikasikan X-ray sebagai indikasi pneumonia, (2) algoritma apa yang paling efektif, dan (3) bagaimana penerapan model ini pada fasilitas kesehatan dengan sumber daya terbatas. Metode yang digunakan dalam proyek ini meliputi pengumpulan dataset citra X-ray dada, pra pemprosesan data, pelatihan model menggunakan algoritma machine learning CNN, evaluasi kinerja model menggunakan metrik akurasi, serta analisis potensi implementasi. Dengan proyek ini, kami berharap dapat menghadirkan solusi teknologi kecerdasan buatan dalam bidang kesehatan, khususnya untuk deteksi penyakit paru-paru pneumonia yang inklusif dan adaptif terhadap tantangan pelayanan kesehatan di Indonesia.

## Cakupan Projek
1. Mengumpulkan data X-ray paru - paru normal dan pneumonia kemudian melakukan proses data wrangling untuk melihat jumlah kelas pada masing-masing gambar serta struktur datanya.
2. Melakukan tahap image preprocessing dengan data augmentasi untuk menambah variasi data sehingga model mengenali pola data dan menghindari overfitting.
3. Membangun model prediktif menggunakan arsitektur CNN dan transfer learning pada data train, dan data validation, kemudian dievaluasi menggunakan data test.
4. Membangun website sederhana dengan integrasi model prediktif yang telah dibuat sebelumnya yang dapat dijalankan.  

## Dataset yang digunakan
Dataset yang digunakan bersumber dari kaggle dengan link sebagai berikut https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia. Dataset ini berisi gambar berlabel pneumonia dan normal. 

## Model yang digunakan
Model yang digunakan adalah model transfer learning MobileNetV2. Model transfer learning ini digunakan karena memiliki keunggulan sebagai berikut : 
1. Efisien dan Ringan : MobileNetV2 didesain untuk perangkat dengan keterbatasan memori dan komputasi (mobile, edge).
2. Pre-trained pada ImageNet : Sudah belajar dari lebih dari 1 juta gambar umum → membantu mengenali pola visual bahkan dari dataset medis.
3. Transfer Learning Siap Pakai : Layer awal sudah peka terhadap pola tekstur, bentuk, dan tepi — cocok untuk X-ray dada.
4. Menghindari Overfitting : Karena hanya sedikit parameter yang dilatih (base model di-freeze), lebih aman untuk dataset kecil/menengah. 
5. Performa Tinggi, Waktu Latih Cepat : Walaupun ringan, performanya kompetitif dibanding model besar (ResNet, VGG) dalam banyak tugas klasifikasi.

Berikut kami sertakan arsitektur model yang digunakan : 
### 🧠 Arsitektur Model (MobileNetV2)

| Layer (Type)                | Output Shape       | Param #    |
|----------------------------|--------------------|------------|
| mobilenetv2_1.00_150       | (None, 5, 5, 1280)  | 2,257,984  |
| GlobalAveragePooling2D     | (None, 1280)        | 0          |
| Dense                      | (None, 128)         | 163,968    |
| Dense                      | (None, 1)           | 129        |
| **Total Parameters**       |                    | **2,422,081** |
| **Trainable Parameters**   |                    | **164,097**  |
| **Non-trainable Parameters** |                  | **2,257,984** |

## Hasil Evaluasi Model


## Penggunaan Sistem Deteksi Pneumonia
Berikut adalah panduan singkat penggunaan sistem deteksi Pneumonia: 
1. Akses link website sistem deteksi pneumonia sebagai berikut https://project-capstone-rho.vercel.app.
2. Dalam website tersebut lakukan log in akun
3. Silahkan isi data identitas pada halaman prediction
4. Upload gambar X-ray pasien pada kolom upload
5. Lakukan submit data pasien, lalu tunggu beberapa saat agar sistem melakukan prediksi pada gambar X-ray.
6. Anda dapat secara langsung melihat hasilnya, semakin tinggi tingkat kepercayaan akan hasil pneumonia maka anda kemungkinan besar anda didiagnosis terkena pneumonia dan membutuhkan penanganan lebih lanjut. 
