import os
import stripe
from fastapi import Request
from database import update_subscription_plan
from app import app

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
host = os.getenv("BASE_URL")


@app.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()
    user_id = data.get('user_id')
    plan = data.get('plan')
    
    if not user_id or not plan:
        return {"error": "Missing user_id or plan"}

    price_id = {
        'pro': 'price_1Rk252PRtWjIO1HPoT0VGUpt',
    }.get(plan)
    
    if not price_id:
        return {"error": "Invalid plan"}
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': price_id,
            'quantity': 1,
        }],
        mode='subscription',
        success_url=f'{host}/profile',
        # success_url=f'http://localhost:5173/success?session_id={{CHECKOUT_SESSION_ID}}',
        cancel_url=f'{host}',
        metadata={
            'user_id': user_id,
            'plan': plan
        }
    )
    return {"checkout_url": session.url}

@app.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except Exception as e:
        return {"error": str(e)}

    # Handle subscription lifecycle events
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata'].get('user_id')
        plan = session['metadata'].get('plan')
        if user_id and plan and session.get('subscription'):
            # Store subscription ID with metadata for later use
            subscription = stripe.Subscription.modify(
                session['subscription'],
                metadata={'user_id': user_id}
            )
            update_subscription_plan(user_id, plan)
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        # Try to get user_id from subscription metadata
        user_id = subscription.get('metadata', {}).get('user_id')
        
        if not user_id:
            # If not in metadata, try to find the customer and get their subscription history
            customer_id = subscription.get('customer')
            if customer_id:
                # Get customer's subscriptions
                subscriptions = stripe.Subscription.list(
                    customer=customer_id,
                    status='all',  # Include all subscriptions
                    limit=1  # We only need the most recent one
                )
                # Check the metadata of past subscriptions
                if subscriptions.data:
                    user_id = subscriptions.data[0].get('metadata', {}).get('user_id')
        
        if user_id:
            print(f"Downgrading user {user_id} to free plan due to subscription cancellation")
            # Downgrade to free plan when subscription is cancelled
            update_subscription_plan(user_id, 'free', is_expiration=True)
        else:
            print("Warning: Could not find user_id in subscription deletion webhook")
    
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        user_id = subscription.get('metadata', {}).get('user_id')
        
        if not user_id:
            # Same fallback as above
            customer_id = subscription.get('customer')
            if customer_id:
                subscriptions = stripe.Subscription.list(
                    customer=customer_id,
                    status='all',
                    limit=1
                )
                if subscriptions.data:
                    user_id = subscriptions.data[0].get('metadata', {}).get('user_id')
        
        if user_id:
            # Check subscription status
            if subscription['status'] not in ['active', 'trialing']:
                print(f"Downgrading user {user_id} to free plan due to subscription status change to {subscription['status']}")
                # Downgrade to free plan if subscription is not active
                update_subscription_plan(user_id, 'free', is_expiration=True)
        else:
            print("Warning: Could not find user_id in subscription update webhook")

    return {"status": "success"} 