import CONFIG from '../config';
import AuthModel from '../models/auth-model.js';

export class StoryModel {
  async fetchStories({ page = 1, size = 10, location = 0 } = {}) {
    try {
      const accessToken = AuthModel.getToken();

      if (!accessToken) {
        throw new Error('User belum login. Token tidak ditemukan.');
      }

      const url = new URL(`${CONFIG.BASE_URL}/stories`);
      url.searchParams.set('page', page);
      url.searchParams.set('size', size);
      url.searchParams.set('location', location);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Gagal memuat cerita (status ${response.status})`);
      }

      const responseJson = await response.json();
      return responseJson.listStory;
    } catch (error) {
      console.error('Error fetching stories:', error.message);
      throw error;
    }
  }
}

const ENDPOINTS = {
  GET_STORIES: `${CONFIG.BASE_URL}/stories`,
};

export const getStories = (...args) => (new StoryModel()).fetchStories(...args);
