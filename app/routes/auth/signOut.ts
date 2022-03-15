import { ActionFunction } from "remix";
import { authenticator } from "~/lib/auth.server";



export const action: ActionFunction = async ({ request }) => {
    let formData = await request.formData();
    let action = formData.get("button");

    switch (action) {
        case "student_signout": {
            return await authenticator.logout(request, { redirectTo: "/" });
        }
        case "lecturer_signout": {
            return await authenticator.logout(request, {redirectTo : '/lecturer'})
        }
        default: {
            throw new Error("Unexpected action");
        }
             
    }
}
  


 
