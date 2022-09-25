import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";
const UserSchema = z.object({
  id: z.string(),
  screen_name: z.string(),
  isListed: z.boolean(),
});
const UserListSchema = z.array(UserSchema);
type UserList = z.TypeOf<typeof UserListSchema>;

export function loadScreenNameList(path: string): string[] {
  const screenNameList = [
    ...new Set(
      Deno.readTextFileSync(path)
        .split(/\r?\n/g)
        .filter((str) => str.length > 0),
    ),
  ];
  return screenNameList;
}

export function loadUserList(path: string): UserList {
  const userList = UserListSchema.parse(
    JSON.parse(Deno.readTextFileSync(path)),
  );
  return userList;
}

export function getDiffScreenNames(
  screenNameList: string[],
  users: UserList,
): string[] {
  const alreadyListedScreenNames = users.map((user) => user.screen_name);
  const newScreenNames = screenNameList.filter((id1) =>
    alreadyListedScreenNames.findIndex((id2) => id1 === id2) === -1
  );
  return newScreenNames;
}

export function addNewUserToUserList(
  screenNameList: string[],
  users: UserList,
): UserList {
  for (const screenName of getDiffScreenNames(screenNameList, users)) {
    users.push({
      screen_name: screenName,
      id: "",
      isListed: false,
    });
  }
  return users;
}

if (import.meta.main) {
  const screenNames = loadScreenNameList("./screen_name.txt");
  const users = loadUserList("./user.json");
  Deno.writeTextFile(
    "user.json",
    JSON.stringify(addNewUserToUserList(screenNames, users)),
  );
}
