function DateToHours(time) {
  const timestamp = time; // Contoh timestamp

  // Buat objek Date dari timestamp
  const date = new Date(timestamp);

  // Ambil jam dan menit
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Tambahkan angka 0 di depan jika jam atau menit kurang dari 10
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  // Gabungkan jam dan menit dengan format yang diinginkan
  const formattedTime = `${hours}.${minutes}`;

  return formattedTime;
}

export default DateToHours;
