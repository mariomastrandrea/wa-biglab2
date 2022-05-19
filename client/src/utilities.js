
function convertToSnakeCase(string) {
   return string.toLowerCase().split(" ").filter(x => x.length > 0).join("-");
}

function revertFromSnakeCase(string) {
   return string.charAt(0).toUpperCase() + string.split("-").join(" ").slice(1);
}

export { convertToSnakeCase, revertFromSnakeCase };

