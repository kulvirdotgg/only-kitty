# Stripe payments handling (maybe)

Just an attempt to create APIs and webhook endpoints needed to handle payments from stripe (Theo said it sucks so trying to figure out why).

> [!WARNING]
> This code is not meant to be used in prod at all. It sucks for real. It probably doesn't event work.

Still If you are figuring out how to setup stripe properly, follow [this guide](https://github.com/t3dotgg/stripe-recommendations) by [Theo](https://youtu.be/Wdyndb17K58) :)


## If I forget how to start this project in future (I probably wouldn't every look at this)

1. Run the seeding script
```sh
bun seed
```

2. Setup the environment variables inside `.env` file. `.env.example` contains the vars you might need.

3. Run the dev server
```sh
bun dev
``` 

4. Open browser
```
http://localhost:42069
```
