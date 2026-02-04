import { supabase } from '../config/supabase.js'
import bcrypt from 'bcrypt'

const resetAdmin = async () => {
    console.log('🔄 Starting admin user reset...')

    const username = 'staffERBE'
    const password = 'hijauERBE'
    const fullName = 'Staff Refresh Breeze'

    try {
        // 1. Generate hash
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        console.log('🔑 Password hash generated.')

        // 2. Upsert user
        const { data, error } = await supabase
            .from('admin_users')
            .upsert({
                username,
                password_hash: passwordHash,
                full_name: fullName
            }, { onConflict: 'username' })
            .select()
            .single()

        if (error) {
            throw error
        }

        console.log('✅ Admin user reset successfully!')
        console.log('Create/Update details:', {
            id: data.id,
            username: data.username,
            full_name: data.full_name
        })

    } catch (err) {
        console.error('❌ Error resetting admin user:', err.message)
        process.exit(1)
    }
}

resetAdmin()
