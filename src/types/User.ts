export type UserType = {
        id: number,
        username: string,
        email: string,
        role: string,
        created_at: string,
};

export type ChangePasswordType = {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
};