import bcrypt from "bcrypt";
import mongoose from "mongoose";

const SALT_WORK_FACTOR = 10;

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    facebook: string;
    tokens: AuthToken[];

    profile: {
        name: string;
        gender: string;
        location: string;
        website: string;
        picture: string;
    };

    comparePassword: comparePasswordFunction;
    gravatar: (size: number) => string;
};

type comparePasswordFunction = (candidatePassword: string) => Promise<boolean>;

export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,

    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
    const user = this as UserDocument;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next(null);

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next(null);
        });
    });
});
     
const comparePassword: comparePasswordFunction = async function (this: UserDocument, candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.comparePassword = comparePassword;


export const User = mongoose.model<UserDocument>("User", userSchema);