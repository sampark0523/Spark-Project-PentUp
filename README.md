# pent_up
This is a PennSpark project inspired by the Unsent Project, an anonymous confession app that was made with the intension of figuring out the color of first love.

Developers: Gordon Chen, Seohyun (Sam) Park, and Ziana Sundrani

Designers: Fiona Herzog, Melody Zhang, and Zara Baig

Project Leads: Gia Gupta and Melody Zhang

#Content Moderation 
This app contains a Supabase Edge Function to use the HuggingFace Inference API with the `unitary/toxic-bert` model (Detoxify) to check messages for toxic content before they are saved.

To run the Detoxify model:
   # 1. Login to Supabase (first time only)
   npx supabase login
   
   # 2. Link your project (if not already linked)
   npx supabase link --project-ref your-project-ref
   
   # 3. Deploy the function
   npx supabase functions deploy moderate-message
   npx supabase functions deploy approve-message    
   npx supabase functions deploy reject-message
   npx supabase functions deploy send-approval-email
