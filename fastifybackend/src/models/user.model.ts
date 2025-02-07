const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            validate: [isEmail, "Invalid Email"],
            unique: [true, "Email already exists"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            validate: [
                (val: String) => val.length >= 2,
                "Password should have a minimum length of 6 characters",
            ],
        },
    },
    { timestamps: true }
);
userSchema.pre("save", async function (next: any) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
