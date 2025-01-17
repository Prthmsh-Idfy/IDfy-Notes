import { Authenticator } from "remix-auth";
import { TUser } from "~/Types/User";
import { FormStrategy } from "remix-auth-form";
import { Users } from "~/sequelize/models/users.model";

// Initialize the Authenticator
export let authenticator = new Authenticator<TUser>();

let users: TUser[] = [
    { userid: "test@example.com", email: "test@example.com", password: "1234" },
    { userid: "prthmsh@example.com", email: "prthmsh@example.com", password: "1234" },
  ];

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");
    return await login(email, password); // Use the login function for authentication
  }),
  "user-pass"
);

async function login(email: FormDataEntryValue | null, password: FormDataEntryValue | null): Promise<TUser> {
  if (typeof email !== "string" || typeof password !== "string") {
    console.log("Error: Invalid email or password type");
    throw new Error("Invalid email or password");
  }
  const user = await findUserByEmailAndPassword(email, password); // Check user credentials
  console.log(user)
  if (!user) {
    console.log("Error: User not found");
    throw new Error("User not found");
  }
  console.log("User authenticated:", user);
  return user;
}

export async function isOnboarded(user: { userid: string }) {
    let UsersData = await Users.findAll()
    const onboardedUsers = UsersData.map((onboardedUser)=>onboardedUser.toJSON() as TUser)
    const isOnboarded = onboardedUsers.some(onboardedUser => onboardedUser.userid === user.userid);
    console.log(`Is user onboarded (${user.userid}):`, isOnboarded);
    return isOnboarded;
  }

export async function registerUser(email: string, password: string) {
  // Replace with actual database logic
  

  if (await isOnboarded({userid:email})) {
    console.log("Error: User already exists");
    return null;
  }

  const newUser = { userid:email,email, password };
  Users.create(newUser)
  console.log("New user registered:", newUser);
  return newUser;
}

async function findUserByEmailAndPassword(email: string, password: string): Promise<TUser | null> {
  
  const user = await Users.findOne({
    where: {
      email: email,
      password: password
    }
  })

  if (!user) {
    console.log("Error: User credentials not found");
    return null;
  }

  const userData = user.toJSON() as TUser
  return userData;
}


