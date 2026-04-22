import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const commonOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(_doc, ret) {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
};

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'frontdesk', 'guest', 'kitchen', 'housekeeping'],
      default: 'guest'
    },
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    avatar: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    salary: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    membershipTier: { type: String, default: 'Silver' },
    loyaltyPoints: { type: Number, default: 0 },
    demo: { type: Boolean, default: false }
  },
  commonOptions
);

const roomSchema = new Schema(
  {
    number: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, default: 2 },
    status: {
      type: String,
      enum: ['available', 'occupied', 'dirty', 'maintenance'],
      default: 'available'
    },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    amenities: [{ type: String }],
    housekeepingNote: { type: String, default: '' },
    demo: { type: Boolean, default: false }
  },
  commonOptions
);

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'Main Course' },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    available: { type: Boolean, default: true },
    demo: { type: Boolean, default: false }
  },
  commonOptions
);

const bookingSchema = new Schema(
  {
    guest: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'],
      default: 'confirmed'
    },
    source: { type: String, enum: ['online', 'walk-in'], default: 'online' },
    guests: { type: Number, default: 1 },
    roomRate: { type: Number, required: true },
    roomTotal: { type: Number, default: 0 },
    foodTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    paymentMethod: { type: String, default: '' },
    paymentProvider: { type: String, default: '' },
    paymentStatus: { type: String, default: '' },
    paymentOrderId: { type: String, default: '' },
    paymentId: { type: String, default: '' },
    paymentSignature: { type: String, default: '' },
    paymentReceipt: { type: String, default: '' },
    paymentCurrency: { type: String, default: '' },
    paymentAmount: { type: Number, default: 0 },
    specialRequest: { type: String, default: '' },
    checkedInAt: { type: Date },
    checkedOutAt: { type: Date },
    demo: { type: Boolean, default: false }
  },
  commonOptions
);

const orderSchema = new Schema(
  {
    guest: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    deliveredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [
      {
        menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'cooking', 'ready', 'delivered'],
      default: 'pending'
    },
    notes: { type: String, default: '' },
    demo: { type: Boolean, default: false }
  },
  commonOptions
);

const cleaningLogSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    housekeeper: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'changed' },
    verified: { type: Boolean, default: true },
    completedAt: { type: Date, default: Date.now },
    demo: { type: Boolean, default: false }
  },
  commonOptions
);

const systemAlertSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    roles: [{
      type: String,
      enum: ['frontdesk', 'guest', 'kitchen', 'housekeeping']
    }],
    route: { type: String, default: '' },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const systemSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'primary' },
    panelLocks: {
      frontdesk: {
        blocked: { type: Boolean, default: false },
        reason: { type: String, default: '' },
        updatedAt: { type: Date }
      },
      guest: {
        blocked: { type: Boolean, default: false },
        reason: { type: String, default: '' },
        updatedAt: { type: Date }
      },
      kitchen: {
        blocked: { type: Boolean, default: false },
        reason: { type: String, default: '' },
        updatedAt: { type: Date }
      },
      housekeeping: {
        blocked: { type: Boolean, default: false },
        reason: { type: String, default: '' },
        updatedAt: { type: Date }
      }
    },
    alerts: [systemAlertSchema]
  },
  commonOptions
);

export const User = models.User || model('User', userSchema);
export const Room = models.Room || model('Room', roomSchema);
export const MenuItem = models.MenuItem || model('MenuItem', menuItemSchema);
export const Booking = models.Booking || model('Booking', bookingSchema);
export const Order = models.Order || model('Order', orderSchema);
export const CleaningLog = models.CleaningLog || model('CleaningLog', cleaningLogSchema);
export const SystemSettings = models.SystemSettings || model('SystemSettings', systemSettingsSchema);
