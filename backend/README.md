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
Model yang digunakan dalam projek ini adalah model Convolutional Neural Network (CNN) dengan arsitektur Sequential untuk tugas klasifikasi 2 kelas (binary classification) mengingat dataset yang digunakan hanya memiliki dua kelas yaitu pneumonia dan normal. Berikut adalah arsitektur CNN yang kami gunakan dalam projek ini : 
Arsitektur Model CNN: `sequential_2`
| Layer (type)                  | Output Shape           | Param #      |
|------------------------------|------------------------|--------------|
| **Conv2D** (`conv2d_3`)      | (None, 224, 224, 32)   | 896          |
| **BatchNormalization**       | (None, 224, 224, 32)   | 128          |
| **MaxPooling2D**             | (None, 112, 112, 32)   | 0            |
| **Conv2D** (`conv2d_4`)      | (None, 112, 112, 64)   | 18,496       |
| **BatchNormalization**       | (None, 112, 112, 64)   | 256          |
| **MaxPooling2D**             | (None, 56, 56, 64)     | 0            |
| **Conv2D** (`conv2d_5`)      | (None, 56, 56, 128)    | 73,856       |
| **BatchNormalization**       | (None, 56, 56, 128)    | 512          |
| **MaxPooling2D**             | (None, 28, 28, 128)    | 0            |
| **Flatten**                  | (None, 100352)         | 0            |
| **Dense** (`dense_3`)        | (None, 128)            | 12,845,184   |
| **Dropout** (`dropout_3`)    | (None, 128)            | 0            |
| **Dense** (`dense_4`)        | (None, 2)              | 258          |

**Total Parameters**: 12,939,586 (≈ 49.36 MB)  
**Trainable Parameters**: 12,939,138  
**Non-trainable Parameters**: 448

Kami menggunakan 


## Hasil Evaluasi Model


## Penggunaan Sistem Deteksi Pneumonia
Berikut adalah panduan singkat penggunaan sistem deteksi Pneumonia: 
1. Akses link website sistem deteksi pneumonia sebagai berikut https://project-capstone-rho.vercel.app.
2. Dalam website tersebut lakukan log in akun
3. Silahkan isi data identitas pada halaman prediction
4. Upload gambar X-ray pasien pada kolom upload
5. Lakukan submit data pasien, lalu tunggu beberapa saat agar sistem melakukan prediksi pada gambar X-ray.
6. Anda dapat secara langsung melihat hasilnya, semakin tinggi tingkat kepercayaan akan hasil pneumonia maka anda kemungkinan besar anda didiagnosis terkena pneumonia dan membutuhkan penanganan lebih lanjut.

## Referensi

