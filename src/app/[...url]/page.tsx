import { ChatWrapper } from '@/components/ChatWrapper';
import { ragChat } from '@/lib/ragchat';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';
import { FC } from 'react'

interface pageProps {
  params : {
    url : string | string[] | undefined
  }
}

function reconstructURL ({url} : {url : string[]}) {
   const decode = url.map((component) => decodeURIComponent(component));

   return decode.join('/');
}

const Page: FC<pageProps> = async ({params}) => {
  const sessionCookie = cookies().get("sessionId")?.value;
  const decodedURI = reconstructURL({url : params.url as string[]});

  const sessionId = (decodedURI + "--" + sessionCookie).replace(/\//g, "");

    const isAlreadyIndexed = await redis.sismember("indexed-urls", decodedURI);

    const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId });

    if (!isAlreadyIndexed) {
      await ragChat.context.add({
        type : "html",
        source : decodedURI,
        config : {chunkOverlap : 50 , chunkSize : 200}
      });

      await redis.sadd("indexed-urls", decodedURI);
    }

  return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />;
}

export default Page