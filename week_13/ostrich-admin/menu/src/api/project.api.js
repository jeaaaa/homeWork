//获取项目列表
export function getProjectList(params) {
  return new Promise((resolve, reject) => {
    var url = new URL(`${location.origin}/project/list`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

//添加项目
export function addProject(project) {
  return new Promise((resolve, reject) => {
    fetch("/project/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
