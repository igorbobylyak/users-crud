export interface User {
    username: string; //(unique)
    firstName: string;
    lastName: string;
    email: string; //(valid email address.)
    password: string; //(min length 8. at least one number and one letter )
    type: UserType; //("Admin", "Driver')
}

export enum UserType {
    ADMIN = 'Admin',
    DRIVER = 'Driver'
}