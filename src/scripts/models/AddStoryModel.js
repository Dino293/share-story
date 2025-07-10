import CONFIG from '../config';
import AuthModel from './auth-model';

export default class AddStoryModel {
  async postStory({ description, photo, lat, lon }) {
    const token = AuthModel.getToken();
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login ulang.');
    }

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat != null) formData.append('lat', String(lat));
    if (lon != null) formData.append('lon', String(lon));

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      console.error('Error saat mengirim cerita:', result);
      throw new Error(result.message || 'Gagal mengirim cerita.');
    }

    console.log('Cerita berhasil dikirim:', result);
    return result;
  }
}
