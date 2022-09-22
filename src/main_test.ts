import { assertArrayIncludes } from "https://deno.land/std@0.156.0/testing/asserts.ts";
import {
  addNewUserToUserList,
  getDiffScreenNames,
  loadScreenNameList,
  loadUserList,
} from "./main.ts";

Deno.test("スクリーンネームの読み込み", () => {
  assertArrayIncludes(
    loadScreenNameList("./test_resources/case_1_screen_name.txt"),
    ["hoge", "huga", "piyo"],
  );
});

Deno.test("user.jsonの読み込み", () => {
  assertArrayIncludes(loadUserList("./test_resources/case_1_user.json"), [
    { screen_name: "nillpo", id: "1234", isListed: false },
  ]);
});

Deno.test("diff user", () => {
  const screenName = ["hoge", "huga"];
  const diff = getDiffScreenNames(
    ["nillpo", ...screenName],
    [{ screen_name: "nillpo", id: "123", isListed: false }],
  );
  assertArrayIncludes(diff, screenName);
});

Deno.test("スクリーンネームから現在のユーザーリストに追加", () => {
  const screenName = ["hoge", "huga"];
  const nillpo = { screen_name: "nillpo", id: "123", isListed: false };
  const diff = addNewUserToUserList(["nillpo", ...screenName], [nillpo]);
  assertArrayIncludes(diff, [
    nillpo,
    ...screenName.map((name) => {
      return { screen_name: name, id: "", isListed: false };
    }),
  ]);
});
