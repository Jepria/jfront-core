export enum Workstates {
  Detail,
  List,
  Edit,
  Search,
  Create,
}

export const useWorkstate = (url: string): Workstates => {
  let state: Workstates;

  const paths = url.split("/");
  if (paths[paths.length - 1] === "") {
    paths.pop();
  }

  switch (paths[paths.length - 1]) {
    case "detail":
      state = Workstates.Detail;
      break;
    case "edit":
      state = Workstates.Edit;
      break;
    case "list":
      state = Workstates.List;
      break;
    case "create":
      state = Workstates.Create;
      break;
    default:
      state = Workstates.Search;
  }
  return state;
};
