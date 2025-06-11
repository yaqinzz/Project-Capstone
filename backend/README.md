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
### Arsitektur Model CNN

| Layer (type)                   | Output Shape          | Param #     |
|-------------------------------|------------------------|-------------|
| conv2d (Conv2D)               | (None, 224, 224, 64)   | 1,792       |
| batch_normalization           | (None, 224, 224, 64)   | 256         |
| max_pooling2d (MaxPooling2D)  | (None, 112, 112, 64)   | 0           |
| dropout (Dropout)             | (None, 112, 112, 64)   | 0           |
| conv2d_1 (Conv2D)             | (None, 112, 112, 128)  | 73,856      |
| batch_normalization_1         | (None, 112, 112, 128)  | 512         |
| max_pooling2d_1 (MaxPooling2D)| (None, 56, 56, 128)    | 0           |
| dropout_1 (Dropout)           | (None, 56, 56, 128)    | 0           |
| conv2d_2 (Conv2D)             | (None, 56, 56, 256)    | 295,168     |
| batch_normalization_2         | (None, 56, 56, 256)    | 1,024       |
| max_pooling2d_2 (MaxPooling2D)| (None, 28, 28, 256)    | 0           |
| dropout_2 (Dropout)           | (None, 28, 28, 256)    | 0           |
| global_average_pooling2d      | (None, 256)            | 0           |
| dense (Dense)                 | (None, 256)            | 65,792      |
| batch_normalization_3         | (None, 256)            | 1,024       |
| dropout_3 (Dropout)           | (None, 256)            | 0           |
| dense_1 (Dense)               | (None, 2)              | 514         |

**Total parameters**: 439,938 (1.68 MB)  
**Trainable parameters**: 438,530 (1.67 MB)  
**Non-trainable parameters**: 1,408 (5.50 KB)

Model tersebut adalah Convolutional Neural Network (CNN) bertipe sequential, yang dirancang untuk klasifikasi citra menjadi 2 kelas (binary classification). Berikut adalah penjelasan ringkasnya:

1. Struktur dan Fungsinya
Blok Convolutional dan Pooling (Feature Extraction):
- Terdiri dari 3 blok utama conv-pooling yang menangkap fitur dari gambar input.
- Masing-masing blok memiliki urutan:
Conv2D → BatchNormalization → MaxPooling2D → Dropout
- Ukuran filter dan kedalaman meningkat di setiap blok:
64 → 128 → 256 filters, sehingga semakin dalam, fitur yang ditangkap makin kompleks.
2. GlobalAveragePooling2D: Mengubah output 3D dari convolution menjadi 1D (flatten), tapi lebih efisien dari Flatten karena rata-rata spasial diambil dari setiap filter, mengurangi jumlah parameter secara drastis.
3. Fully Connected Layers (Classification):
- Dense (256 units): lapisan utama untuk mempelajari kombinasi fitur.
- BatchNormalization + Dropout: mencegah overfitting dan menstabilkan pelatihan.
- Dense (2 units): output akhir dengan 2 neuron (untuk 2 kelas), biasanya disambung dengan fungsi aktivasi softmax (meskipun tidak terlihat di sini, biasanya ditambahkan di compile atau fit).

Model ini memiliki kelebihan yaitu adanya kombinasi BatchNormalization + Dropout memberikan kestabilan dan mencegah overfitting. GlobalAveragePooling membuat model ringan tanpa mengorbankan akurasi. Arsitektur cukup dalam untuk mendeteksi pola kompleks dari gambar (misalnya: pneumonia vs normal).

## Hasil Evaluasi Model

![Training, Validation, and Test Accuracy and Loss](https://raw.githubusercontent.com/yaqinzz/Project-Capstone/main/Modelling/Hasil%20Akurasi%20Data%20Training,%20Validation,%20dan%20Testing.png)

1. Akurasi (Kiri)
Grafik kiri menunjukkan akurasi model selama proses pelatihan (Training Accuracy) dan validasi (Validation Accuracy) terhadap jumlah epoch.
- Akurasi training meningkat secara konsisten seiring bertambahnya epoch, yang mengindikasikan model berhasil mempelajari pola dari data pelatihan.
- Akurasi validasi menunjukkan fluktuasi yang cukup signifikan, terutama di awal epoch, namun secara umum mengalami peningkatan dan mencapai titik yang sebanding dengan akurasi training di akhir pelatihan.
- Garis merah putus-putus menunjukkan akurasi data uji (test accuracy), yang tampak stabil dan berada di sekitar nilai 0.86, menandakan model memiliki kemampuan generalisasi yang baik terhadap data yang tidak terlihat saat pelatihan.
- 
Kesimpulan: Model berhasil mencapai akurasi tinggi dan stabil di dataset uji, meskipun validasi sempat menunjukkan overfitting ringan di tengah proses.

2. Loss (Kanan)
Grafik kanan menggambarkan nilai kerugian (Loss) untuk data pelatihan, validasi, dan pengujian terhadap jumlah epoch.
- Training loss menurun secara konsisten, menunjukkan bahwa model terus meminimalkan kesalahan pada data pelatihan.
- Validation loss mengalami fluktuasi besar, terutama pada awal epoch. Hal ini bisa menunjukkan ketidaksesuaian sementara antara model dan data validasi (misalnya karena distribusi yang berbeda atau jumlah data yang sedikit).
- Garis merah putus-putus menunjukkan nilai loss pada data uji (test loss), yang relatif rendah dan stabil, memperkuat bahwa model tidak overfitting secara signifikan.
Kesimpulan: Meskipun validation loss sempat tidak stabil, rendahnya nilai test loss menunjukkan model memiliki performa generalisasi yang baik dan tidak terlalu overfitting.

Selain akurasi data training, validation, dan testing. Evaluasi juga dilakukan dengan melihat confusion matrixnya. Berikut adalah confusion matrixnya: 

![Confusion Matrix](https://raw.githubusercontent.com/yaqinzz/Project-Capstone/main/Modelling/Confusion%20Matrix.png)

Berdasarkan tabel tersebut dapat dihitung metrik evaluasi yaitu akurasi, presisi, recall, dan F1-Score. 
- **Accuracy**: `(TP + TN) / Total` = `(395 + 107) / 583` ≈ **86.1%**
- **Precision (PNEUMONIA)**: `TP / (TP + FP)` = `395 / (395 + 51)` ≈ **88.6%**
- **Recall (Sensitivity)**: `TP / (TP + FN)` = `395 / (395 + 30)` ≈ **92.9%**
- **F1-Score**: `2 × (Precision × Recall) / (Precision + Recall)` ≈ **90.7%**

Secara umum Model memiliki **akurasi tinggi** dalam mendeteksi kasus *pneumonia*.
- **False Negative (FN)** hanya 30, artinya model cukup baik dalam menghindari kesalahan fatal (tidak mendeteksi pasien yang sebenarnya sakit).
- Namun terdapat **False Positive (FP)** sebanyak 51, yaitu kasus pasien sehat yang salah diklasifikasi sebagai pneumonia.
- Secara keseluruhan, model ini **cocok untuk digunakan pada sistem deteksi awal penyakit**, karena cenderung mengutamakan sensitivitas (recall) daripada presisi.

## Penggunaan Sistem Deteksi Pneumonia
Berikut adalah panduan singkat penggunaan sistem deteksi Pneumonia: 
1. Akses link website sistem deteksi pneumonia sebagai berikut https://project-capstone-rho.vercel.app.
2. Dalam website tersebut lakukan log in akun
3. Silahkan isi data identitas pada halaman prediction
4. Upload gambar X-ray pasien pada kolom upload
5. Lakukan submit data pasien, lalu tunggu beberapa saat agar sistem melakukan prediksi pada gambar X-ray.
6. Anda dapat secara langsung melihat hasilnya, semakin tinggi tingkat kepercayaan akan hasil pneumonia maka anda kemungkinan besar anda didiagnosis terkena pneumonia dan membutuhkan penanganan lebih lanjut.

## Referensi
https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia
Wati, R. A., Irsyad, H., & Al Rivan, M. E. (2020). Klasifikasi Pneumonia Menggunakan Metode Support Vector Machine. J. Algoritm, 1(1), 21-32.
Maysanjaya, I. M. D., & Dendi, M. (2020). Klasifikasi Pneumonia pada Citra X-rays Paru-paru dengan Convolutional neural network. Jurnal Nasional Teknik Elektro Dan Teknologi Informasi, 9(2), 190-195.
