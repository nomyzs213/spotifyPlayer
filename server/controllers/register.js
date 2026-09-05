
import bcrypt  from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const isLocal = process.env.NODE_ENV === "production"

async function sendLinkingReq(req , res){
    const scopes = [
        'user-top-read',
        'user-read-private',
        'playlist-read-collaborative',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-read-email'
    ].join(' ');

    const state = crypto.randomBytes(16).toString('hex');
    res.cookie('state' , state , {httpOnly: true , secure: isLocal, maxAge: 1000 * 60 * 60 * 24 * 7});

    const params = new URLSearchParams({
        response_type: 'code',
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        scope: scopes,
        state: state
    });
    process.exit(0);

    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());


}
async function register(req , res){
    const {username , email , password} = req.body.registrationData;
    if(!username || !email || !password) return res.status(400).json("cant register without email or username");

    if(username.isLowercase() && username.length >= 3 && email.length >= 3 && email.isLowercase() || password.length >= 8) {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hashSync(password, salt);
            const cookie = {username , email , hashedPassword};
            res.cookie('pending_registration' , cookie , {httpOnly: true, secure: isLocal , maxAge: 1000 * 60 * 30});
            await sendLinkingReq(req , res);

            return res.status(201).json("user was registered successfully");

        }
        catch (error){
            console.log(error);
            return res.status(500).json("database error");
        }
    }

    return res.status(400).json("cant register when email or username is invalid");
}
