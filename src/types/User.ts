export type UserType = {
        id: number,
        username: string,
        email: string,
        role: string,
        is_admin?: boolean,
        created_at: string,
};

export type ChangePasswordType = {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
};
