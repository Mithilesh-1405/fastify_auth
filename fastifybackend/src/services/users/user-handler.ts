import { userBody } from "../../types";
import User from "../../models/user.model";
import { LoginCredentials } from "../../types";
import { createJWT } from "../../configs/createjwt";
const bcrypt = require("bcrypt");

const handleErrors = (err: any) => {
    const errors = { name: "", email: "", password: "" };
    if (err.message.includes("Name")) {
        errors.name = "Name is Required";
    }
    if (err.message.includes("Password")) {
        errors.password = "Password should have a minimum length of 6 characters";
    }
    if (err.message.includes("Email")) {
        errors.email = "Invalid Email";
    }
    if (err.errors && typeof err.errors === "object") {
        Object.values(err.errors).forEach((errObj: any) => {
            if (errObj.properties && errObj.properties.path in errors) {
                errors[errObj.properties.path as keyof typeof errors] = errObj.properties.message;
            }
        });
    }
    return errors;
};

export const signup = async (user: userBody) => {
    try {
        const newUser = await User.create(user);
        if (!newUser) {
            throw new Error("User not created");
        }
        return { success: true, data: newUser };
    } catch (err: any) {
        const errors: any = handleErrors(err);
        console.log(errors);
        throw new Error(JSON.stringify(errors));
    }
};

export const getAllUsers = async () => {
    try {
        const allUsers = await User.find();
        if (!allUsers.length) {
            throw new Error("No users found");
        }
        return { success: true, data: allUsers };
    } catch (err: any) {
        const errors: any = handleErrors(err);
        throw new Error(errors);
    }
};

export const loginUser = async ({ email, password }: LoginCredentials) => {
    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
        throw new Error("User is not registered, please signin");
    }

    const isPasswordMatch = await bcrypt.compare(password, registeredUser.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid credentials");
    }
    const accessToken = createJWT(registeredUser._id, "access");
    const refreshToken = createJWT(registeredUser._id, "refresh");
    return {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
};
