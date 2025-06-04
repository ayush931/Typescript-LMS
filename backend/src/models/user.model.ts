import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [5, 'Name should be less than 50 characters'],
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
      // uses the regex to validate the email at database level
      match: [
        /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
        'Please enter a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be atleast 8 character'],
      select: false,
    },

    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },

    forgetPasswordToken: String,
    forgotPasswordExpiry: Date,

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
  }
);

// do some work before saving the data in the database
userSchema.pre('save', async function (next) {
  // if password is not modified, skip this part
  if (!this.isModified('password')) {
    return next();
  }

  // encrypt the password before saving it to the database
  this.password = await bcrypt.hash(this.password, 10);
});

// writing generic methods
userSchema.methods = {
  generateJwtToken: function () {
    return jwt.sign(
      { id: this._id, email: this.email, role: this.role },
      process.env.JWT_TOKEN as string,
      { expiresIn: (process.env.JWT_EXPIRY as string) || '1h' }
    );
  },
};

// creating model to access the schema in the user
const User = model('User', userSchema);
export default User;
