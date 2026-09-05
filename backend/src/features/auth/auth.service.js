const supabase = require('../../config/supabase');

async function registerUser({ email, password, fullName, contactNumber }) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        throw new Error(authError.message);
    }

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: authData.user.id,
            full_name: fullName,
            contact_number: contactNumber,
            role: 'customer',
        })
        .select()
        .single();

    if (profileError) {
        throw new Error(profileError.message);
    }

    return {
        user: authData.user,
        profile: profileData
    };
}

async function loginUser({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

module.exports = { registerUser, loginUser };