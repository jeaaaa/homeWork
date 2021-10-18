const fetch = require("isomorphic-fetch");
describe("mysql", () => {
  test("project/add", async () => {
    const data = {
      name: "多屏管理",
      label: "基础架构部",
    };
    let result = await fetch("http://localhost:5000/project/add", {
      method: "POST", // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }).then(function (response) {
      return response.json();
    });
    expect(result.code).toBe(200);
  });

  test("project/list", async () => {
    let result = await fetch("http://localhost:5000/project/list", {
      method: "GET", // or 'PUT'
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }).then(function (response) {
      return response.json();
    });
    expect(result.code).toBe(200);
    expect(result.data.length).toBeGreaterThan(0);
  });
});
