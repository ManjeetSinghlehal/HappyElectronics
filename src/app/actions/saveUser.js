"use server";
import User from "@/models/User";
import generateId from "./generateId";

export const saveUser = async (session, provider) => {

    if (User) {
        console.log("under if in saveUser");
        console.log(session);
        console.log(provider);
        
        // saving user to the db if the session has value
        try {
            if (session.id && provider) {
                const { id, name, email, image } = session;
                const providerId = parseInt(id);
                const userEmail = await User.findOne({ email: email });
                // generating a unique user id
                const userUniqueId = await generateId();

                if (!userEmail) {
                    // if user is not found, saving the data with the provider info
                    const user = await User.insertOne({
                        id: userUniqueId,
                        providers: [{
                            name: provider,
                            userId: providerId
                        }],
                        imageUrl: image || '',
                        name: name,
                        email: email,
                        isVerified: true
                    });
                    
                } else {
                    // if email is found, checking whether the providers array contains the data
                    const providerDoc = await userEmail.providers.filter(p => {
                        
                        return p.name === provider &&
                            p.userId === providerId;
                    });
                    
                    
                    // if not, we will just update the providers array to have the provider's info
                    if (providerDoc.length === 0) {
                        
                        await User.updateOne({ email: userEmail.email }, {
                            $push: {
                                providers: {
                                    name: provider,
                                    userId: providerId
                                }
                            },
                            $set: { isVerified: true }
                        })
                    }
                }
            } else{
                return false;
            }
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}