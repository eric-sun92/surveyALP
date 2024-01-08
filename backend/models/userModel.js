import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    alpID: {
      type: String,
      required: true,
    },
    sid: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    rand: {
      type: Number,
    },
    servicesPermutation: {
      type: [String], // Array of strings
    },
    itemOrder: {
      type: [Number]
    },
    isControl: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
)

function shuffleArray(array) {
  const arr = [...array]; // Create a copy of the array
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
  return arr;
}


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {

  const services = [
    "Acme",
    "Poseidon",
    "Betamax",
    "iBuy",
    "Gammamex",
    "OmegaBlue",
  ];

  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  this.rand = Math.floor(Math.random() * 33)
  this.servicesPermutation = shuffleArray(services);

  const itemOrder = [0, 1, 2, 3, 4, 5];
  this.itemOrder = shuffleArray(itemOrder);

  this.isControl = Math.random() >= 0.5;

})

const User = mongoose.model('User', userSchema)

export default User
