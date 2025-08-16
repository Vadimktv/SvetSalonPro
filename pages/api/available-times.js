import { getAvailableTimeSlots } from './booked-times.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date parameter is required' });
  }

  try {
    const availableSlots = getAvailableTimeSlots(date);
    res.status(200).json({ 
      success: true, 
      availableSlots,
      date 
    });
  } catch (error) {
    console.error('Ошибка при получении доступных временных слотов:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при получении доступных временных слотов' 
    });
  }
}
