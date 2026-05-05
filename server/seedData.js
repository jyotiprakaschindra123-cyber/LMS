import bcrypt from 'bcryptjs';
import { Booking, CleaningLog, MenuItem, Order, Room, User } from './models.js';

export const images = {
  hero: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
  login: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
  single: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80',
  double: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
  suite: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
  paneer: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80'
};

const addDays = (offset) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
};

export async function seedDatabase({ force = false } = {}) {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0 && !force) {
    return { skipped: true };
  }

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      MenuItem.deleteMany({}),
      Booking.deleteMany({}),
      Order.deleteMany({}),
      CleaningLog.deleteMany({})
    ]);
  }

  const password = async (plain) => bcrypt.hash(plain, 10);
  const [adminPass, frontPass, guestPass, kitchenPass, cleanPass] = await Promise.all([
    password('hms123'),
    password('front123'),
    password('guest123'),
    password('kitchen123'),
    password('clean123')
  ]);

  const users = await User.insertMany([
    {
      username: 'hmsadmin',
      email: 'admin@gmail.com',
      password: adminPass,
      role: 'admin',
      firstName: 'Head',
      lastName: 'Admin',
      phone: '+91 70000 11111',
      jobTitle: 'General Manager',
      salary: 90000,
      experience: 8,
      demo: true
    },
    {
      username: 'frontdesk',
      email: 'frontdesk@utkalreserve.com',
      password: frontPass,
      role: 'frontdesk',
      firstName: 'Nandita',
      lastName: 'Das',
      phone: '+91 70000 22222',
      jobTitle: 'Receptionist',
      salary: 42000,
      experience: 3,
      demo: true
    },
    {
      username: 'sumit',
      email: 'guest@utkalreserve.com',
      password: guestPass,
      role: 'guest',
      firstName: 'Sumit',
      lastName: 'Kumar',
      phone: '+91 70000 33333',
      address: '221 Kharavela Nagar, Bhubaneswar',
      membershipTier: 'Silver',
      loyaltyPoints: 71,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      demo: true
    },
    {
      username: 'kitchen',
      email: 'kitchen@utkalreserve.com',
      password: kitchenPass,
      role: 'kitchen',
      firstName: 'Rohan',
      lastName: 'Chef',
      phone: '+91 70000 44444',
      jobTitle: 'Kitchen Staff',
      salary: 39000,
      experience: 5,
      demo: true
    },
    {
      username: 'housekeeper',
      email: 'housekeeping@utkalreserve.com',
      password: cleanPass,
      role: 'housekeeping',
      firstName: 'Sushil',
      lastName: 'Kumar',
      phone: '+91 70000 55555',
      jobTitle: 'Housekeeping',
      salary: 28000,
      experience: 2,
      avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=300&q=80',
      demo: true
    }
  ]);

  const guest = users.find((user) => user.role === 'guest');
  const kitchenStaff = users.find((user) => user.role === 'kitchen');
  const housekeeper = users.find((user) => user.role === 'housekeeping');

  const rooms = await Room.insertMany([
    {
      number: '101',
      type: 'Single Room',
      price: 71,
      capacity: 1,
      status: 'available',
      image: images.single,
      description: 'A calm single room with a city view and compact work corner.',
      amenities: ['Wi-Fi', 'Breakfast', 'City view'],
      demo: true
    },
    {
      number: '102',
      type: 'Double Room',
      price: 92,
      capacity: 2,
      status: 'occupied',
      image: images.double,
      description: 'Spacious double room with warm lighting and premium bedding.',
      amenities: ['Wi-Fi', 'Breakfast', 'Room service'],
      demo: true
    },
    {
      number: '103',
      type: 'Suite',
      price: 180,
      capacity: 4,
      status: 'available',
      image: images.suite,
      description: 'Suite with separate lounge, private dining area, and spa bath.',
      amenities: ['Mini bar', 'Sea view', 'Jacuzzi'],
      demo: true
    },
    {
      number: '104',
      type: 'Double Room',
      price: 92,
      capacity: 2,
      status: 'dirty',
      image: images.double,
      description: 'Double room awaiting housekeeping verification.',
      amenities: ['Wi-Fi', 'Balcony', 'Tea station'],
      housekeepingNote: 'Linen change and restroom reset',
      demo: true
    },
    {
      number: '201',
      type: 'Single Room',
      price: 78,
      capacity: 1,
      status: 'available',
      image: images.single,
      description: 'Quiet upper-floor room for business stays.',
      amenities: ['Desk', 'Wi-Fi', 'Breakfast'],
      demo: true
    },
    {
      number: '202',
      type: 'Double Room',
      price: 110,
      capacity: 2,
      status: 'available',
      image: images.double,
      description: 'Garden-facing double room with soft seating.',
      amenities: ['Garden view', 'Room service', 'Wi-Fi'],
      demo: true
    },
    {
      number: '203',
      type: 'Suite',
      price: 220,
      capacity: 4,
      status: 'maintenance',
      image: images.suite,
      description: 'Luxury suite temporarily paused for maintenance.',
      amenities: ['Lounge', 'Spa bath', 'Premium bar'],
      demo: true
    },
    {
      number: '301',
      type: 'Single Room',
      price: 86,
      capacity: 1,
      status: 'available',
      image: images.single,
      description: 'Top-floor compact room with fast check-in access.',
      amenities: ['Smart TV', 'Wi-Fi', 'Breakfast'],
      demo: true
    },
    {
      number: '302',
      type: 'Double Room',
      price: 125,
      capacity: 2,
      status: 'available',
      image: images.double,
      description: 'Premium double room close to the elevator.',
      amenities: ['King bed', 'Wi-Fi', 'Room service'],
      demo: true
    },
    {
      number: '401',
      type: 'Suite',
      price: 260,
      capacity: 4,
      status: 'available',
      image: images.suite,
      description: 'Signature suite designed for long stays and celebrations.',
      amenities: ['Private lounge', 'Dining', 'Sea view'],
      demo: true
    }
  ]);

  const menu = await MenuItem.insertMany([
    {
      name: 'Burger',
      category: 'Starter',
      price: 13,
      image: images.burger,
      description: 'Grilled burger with house sauce and crisp salad.',
      available: true,
      demo: true
    },
    {
      name: 'Paneer',
      category: 'Main Course',
      price: 30,
      image: images.paneer,
      description: 'Creamy paneer curry served with fragrant rice.',
      available: true,
      demo: true
    }
  ]);

  const activeRoom = rooms.find((room) => room.number === '102');
  const singleRoom = rooms.find((room) => room.number === '101');
  const suiteRoom = rooms.find((room) => room.number === '103');

  const bookings = await Booking.insertMany([
    {
      guest,
      room: activeRoom,
      checkIn: addDays(-1),
      checkOut: addDays(1),
      status: 'checked-in',
      source: 'online',
      guests: 2,
      roomRate: activeRoom.price,
      roomTotal: activeRoom.price * 2,
      grandTotal: activeRoom.price * 2,
      checkedInAt: addDays(-1),
      demo: true
    },
    {
      guest,
      room: singleRoom,
      checkIn: addDays(3),
      checkOut: addDays(5),
      status: 'confirmed',
      source: 'online',
      guests: 1,
      roomRate: singleRoom.price,
      roomTotal: singleRoom.price * 2,
      grandTotal: singleRoom.price * 2,
      demo: true
    },
    {
      guest,
      room: suiteRoom,
      checkIn: addDays(-35),
      checkOut: addDays(-32),
      status: 'completed',
      source: 'walk-in',
      guests: 2,
      roomRate: suiteRoom.price,
      roomTotal: suiteRoom.price * 3,
      foodTotal: 43,
      grandTotal: suiteRoom.price * 3 + 43,
      paymentMethod: 'Credit/Debit Card',
      checkedInAt: addDays(-35),
      checkedOutAt: addDays(-32),
      demo: true
    }
  ]);

  await Order.insertMany([
    {
      guest,
      booking: bookings[0],
      room: activeRoom,
      items: [{ menuItem: menu[0], name: menu[0].name, price: menu[0].price, quantity: 1 }],
      total: menu[0].price,
      status: 'pending',
      notes: 'No onion',
      demo: true
    },
    {
      guest,
      booking: bookings[0],
      room: activeRoom,
      items: [{ menuItem: menu[1], name: menu[1].name, price: menu[1].price, quantity: 1 }],
      total: menu[1].price,
      status: 'delivered',
      deliveredBy: kitchenStaff,
      demo: true
    },
    {
      guest,
      booking: bookings[2],
      room: suiteRoom,
      items: [
        { menuItem: menu[0], name: menu[0].name, price: menu[0].price, quantity: 1 },
        { menuItem: menu[1], name: menu[1].name, price: menu[1].price, quantity: 1 }
      ],
      total: menu[0].price + menu[1].price,
      status: 'delivered',
      deliveredBy: kitchenStaff,
      demo: true
    }
  ]);

  await CleaningLog.insertMany([
    {
      room: singleRoom,
      housekeeper,
      status: 'changed',
      verified: true,
      completedAt: addDays(-2),
      demo: true
    },
    {
      room: suiteRoom,
      housekeeper,
      status: 'changed',
      verified: true,
      completedAt: addDays(-5),
      demo: true
    }
  ]);

  return { skipped: false };
}
