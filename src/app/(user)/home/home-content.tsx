'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SavedPrompt } from '@prisma/client';
import { RiTelegram2Fill, RiTwitterXFill } from '@remixicon/react';
import { JSONValue } from 'ai';
import { useChat } from 'ai/react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import ChatInterface from '@/app/(user)/chat/[id]/chat-interface';
import { Badge } from '@/components/ui/badge';
import BlurFade from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import TypingAnimation from '@/components/ui/typing-animation';
import useAccessStore from '@/hooks/store/acessKey';
import { useConversations } from '@/hooks/use-conversations';
import { useUser } from '@/hooks/use-user';
import { EVENTS } from '@/lib/events';
import { SolanaUtils } from '@/lib/solana';
import { cn } from '@/lib/utils';
import { checkEAPTransaction } from '@/server/actions/eap';
import { getSavedPrompts } from '@/server/actions/saved-prompt';

import { IntegrationsGrid } from './components/integrations-grid';
import { ConversationInput } from './conversation-input';
import { getRandomSuggestions } from './data/suggestions';
import { SuggestionCard } from './suggestion-card';

const EAP_PRICE = 1.0;
const RECEIVE_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_EAP_RECEIVE_WALLET_ADDRESS!;

const EAP_BENEFITS = [
  'Support platform growth',
  'Early access to features',
  'Unlimited AI interactions',
  'Join early governance and decisions',
];

interface SectionTitleProps {
  children: React.ReactNode;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="mb-2 px-1 text-sm font-medium text-muted-foreground/80">
      {children}
    </h2>
  );
}

export function HomeContent() {
  const pathname = usePathname();
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isFetchingSavedPrompts, setIsFetchingSavedPrompts] =
    useState<boolean>(true);
  const suggestions = useMemo(() => getRandomSuggestions(4), []);
  const [showChat, setShowChat] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatId, setChatId] = useState(() => uuidv4());
  const { user, isLoading } = useUser();
  const [accessCodeToken, setaccessCodeToken] = useState<string>('');
  const [verifyingTx, setVerifyingTx] = useState<string | null>(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const { accessCode, isValid, setAccessCode, setIsValid } = useAccessStore();
  const MAX_VERIFICATION_ATTEMPTS = 20;
  const { conversations, refreshConversations } = useConversations(user?.id);

  const resetChat = useCallback(() => {
    setShowChat(false);
    setChatId(uuidv4());
  }, []);

  const INVALID_ACCESS_CODE =
    'Your code is either expired or already used. 🔒 Please check your code and try again, or request a new one';
  const handleSubmitAccessCode = async () => {
    if (!accessCodeToken || accessCodeToken.length < 2) {
      toast('Not valid access token');
    }
    try {
      setIsProcessing(true);
      const res = await fetch('/api/access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCodeToken }),
      });
      const data = await res.json();
      setIsValid(data.valid);
      if (!data.valid) {
        toast(INVALID_ACCESS_CODE);
        setIsProcessing(false);
      }
      setAccessCode(accessCodeToken);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error checking access code:', error);
      setIsProcessing(false);
    }
    setAccessCode(accessCodeToken);
  };

  /*----------------------------------
         FETCH SAVED pROMPTS
    ------------------------------------*/
  useEffect(() => {
    async function fetchSavedPrompts() {
      try {
        const res = await getSavedPrompts();
        const savedPrompts = res?.data?.data || [];

        setSavedPrompts(savedPrompts);
      } catch (err) {
        console.error(err);
      }
      setIsFetchingSavedPrompts(false);
    }
    fetchSavedPrompts();
  }, []);

  const { messages, input, handleSubmit, setInput } = useChat({
    id: chatId,
    initialMessages: [],
    body: { id: chatId },
    onFinish: () => {
      // Only refresh if we have a new conversation that's not in the list
      if (chatId && !conversations?.find((conv) => conv.id === chatId)) {
        refreshConversations().then(() => {
          // Dispatch event to mark conversation as read
          window.dispatchEvent(new CustomEvent(EVENTS.CONVERSATION_READ));
        });
      }
    },
    experimental_prepareRequestBody: ({ messages }) => {
      return {
        message: messages[messages.length - 1],
        id: chatId,
      } as unknown as JSONValue;
    },
  });
  /*------------------------------
  ACESS KEY CHECKER
  ----------------------------------*/
  // Function to check code validity
  const checkAccessCode = async () => {
    if (!accessCode) return;
    try {
      const res = await fetch('/api/access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      });
      const data = await res.json();
      setIsValid(data.valid);
    } catch (error) {
      console.error('Error checking access code:', error);
    }
  };

  // Run validation every 5 minutes
  useEffect(() => {
    if (!accessCode) return;

    checkAccessCode(); // Check immediately when the code is set
    const interval = setInterval(checkAccessCode, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [accessCode]);
  /*----------------------------------
         PAYMENT VERIFICATION 
    ------------------------------------*/
  useEffect(() => {
    if (!verifyingTx) return;

    const verify = async () => {
      try {
        const response = await checkEAPTransaction({ txHash: verifyingTx });
        if (response?.data?.success) {
          toast.success('EAP Purchase Successful', {
            description:
              'Your Early Access Program purchase has been verified. Please refresh the page.',
          });
          setVerifyingTx(null);
          return;
        }

        // Continue verification if not reached max attempts
        if (verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
          setVerificationAttempts((prev) => prev + 1);
        } else {
          // Max attempts reached, show manual verification message
          toast.error('Verification Timeout', {
            description:
              'Please visit the FAQ page to manually verify your transaction.',
          });
          setVerifyingTx(null);
        }
      } catch (error) {
        console.error('Verification error:', error);
        // Continue verification if not reached max attempts
        if (verificationAttempts < MAX_VERIFICATION_ATTEMPTS) {
          setVerificationAttempts((prev) => prev + 1);
        }
      }
    };

    const timer = setTimeout(verify, 3000);
    return () => clearTimeout(timer);
  }, [verifyingTx, verificationAttempts]);

  const handleSend = async (value: string) => {
    if (!value.trim()) return;

    // CHECK ACCESS RIGHTS
    if (!user || !accessCode || !isValid) {
      return;
    }

    const fakeEvent = new Event('submit') as any;
    fakeEvent.preventDefault = () => {};

    await handleSubmit(fakeEvent, { data: { content: value } });
    setShowChat(true);
    window.history.replaceState(null, '', `/chat/${chatId}`);
  };

  const handlePurchase = async () => {
    if (!user) return;
    setIsProcessing(true);
    setVerificationAttempts(0);

    try {
      const tx = await SolanaUtils.sendTransferWithMemo({
        to: RECEIVE_WALLET_ADDRESS,
        amount: EAP_PRICE,
        memo: `{
                    "type": "EAP_PURCHASE",
                    "user_id": "${user.id}"
                }`,
      });

      if (tx) {
        setVerifyingTx(tx);
        toast.success('Transaction Sent', {
          description: 'Transaction has been sent. Verifying your purchase...',
        });
      } else {
        toast.error('Transaction Failed', {
          description: 'Failed to send the transaction. Please try again.',
        });
      }
    } catch (error) {
      console.error('Transaction error:', error);

      let errorMessage = 'Failed to send the transaction. Please try again.';

      if (error instanceof Error) {
        const errorString = error.toString();
        if (
          errorString.includes('TransactionExpiredBlockheightExceededError')
        ) {
          toast.error('Transaction Timeout', {
            description: (
              <>
                <span className="font-semibold">
                  Transaction might have been sent successfully.
                </span>
                <br />
                If SOL was deducted from your wallet, please visit the FAQ page
                and input your transaction hash for manual verification.
              </>
            ),
          });
          return;
        }
        errorMessage = error.message;
      }

      toast.error('Transaction Failed', {
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset chat when pathname changes to /home
  useEffect(() => {
    if (pathname === '/home') {
      resetChat();
    }
  }, [pathname, resetChat]);

  // 监听浏览器的前进后退
  useEffect(() => {
    const handlePopState = () => {
      if (location.pathname === '/home') {
        resetChat();
      } else if (location.pathname === `/chat/${chatId}`) {
        setShowChat(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [chatId, resetChat]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasEAP = user?.earlyAccess === true;

  /*----------------------------------
         MAIN CONTENTS
    ------------------------------------*/
  const mainContent = (
    <div
      className={cn(
        'mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6',
        !hasEAP ? 'h-screen py-0' : 'py-12',
      )}
    >
      <BlurFade delay={0.2}>
        <TypingAnimation
          className="mb-12 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-center text-4xl font-semibold tracking-tight text-transparent md:text-4xl lg:text-5xl"
          duration={50}
          text="How can I assist you?"
        />
      </BlurFade>

      <div className="mx-auto w-full max-w-3xl space-y-8">
        <BlurFade delay={0.1}>
          <ConversationInput
            value={input}
            onChange={setInput}
            onSubmit={handleSend}
          />
        </BlurFade>

        {accessCode && isValid && (
          <div className="space-y-8">
            {/* HIDE SUGGETIONS */}
            {/* <BlurFade delay={0.2}>
              <div className="space-y-2">
               
              <SectionTitle>Suggestions</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  {suggestions.map((suggestion, index) => (
                    <SuggestionCard
                      key={suggestion.title}
                      {...suggestion}
                      delay={0.3 + index * 0.1}
                      onSelect={setInput}
                    />
                  ))}
                </div>
              </div>
            </BlurFade>*/}

            {!isFetchingSavedPrompts && savedPrompts.length !== 0 && (
              <BlurFade delay={0.3}>
                <div className="space-y-2">
                  <SectionTitle>Saved Prompts</SectionTitle>
                  {isFetchingSavedPrompts ? (
                    <div className="flex w-full items-center justify-center pt-20">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {savedPrompts
                        .slice(0, Math.min(4, savedPrompts.length))
                        .map((savedPrompt, index) => (
                          <SuggestionCard
                            id={savedPrompt.id}
                            useSubtitle={true}
                            title={savedPrompt.title}
                            subtitle={savedPrompt.content}
                            key={savedPrompt.id}
                            delay={0.3 + index * 0.1}
                            onSelect={setInput}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </BlurFade>
            )}

            <BlurFade delay={0.4}>
              <div className="space-y-2">
                <SectionTitle>Integrations</SectionTitle>
                <IntegrationsGrid />
              </div>
            </BlurFade>
          </div>
        )}
      </div>
    </div>
  );

  /*----------------------------------
         NO ACCESS 
    ------------------------------------*/
  /*if (!hasEAP) {
    return (
      <div className="relative h-screen w-full overflow-hidden text-xs sm:text-base">
        <div className="absolute inset-0 z-10 bg-background/30 backdrop-blur-md" />
        {mainContent}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="mx-auto max-h-screen max-w-xl overflow-y-auto p-6">
            <Card className="relative max-h-full border-white/[0.1] bg-white/[0.02] p-4 backdrop-blur-sm backdrop-saturate-150 dark:bg-black/[0.02] sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-white/[0.02] dark:from-white/[0.02] dark:to-white/[0.01]" />
              <div className="relative space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-lg font-semibold sm:text-2xl">
                    Early Access Program
                  </h2>
                  <div className="text-muted-foreground">
                    We&apos;re currently limiting <Badge>BETA</Badge> access to
                    a limited amount of users to ensure stable service while
                    continuing to refine features.
                  </div>
                </div>

                <Card className="border-teal-500/10 bg-white/[0.01] p-6 backdrop-blur-sm dark:bg-black/[0.01]">
                  <h3 className="mb-4 font-semibold">EAP Benefits</h3>
                  <div className="space-y-3">
                    {EAP_BENEFITS.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-1 h-4 w-4 text-teal-500" />
                        <span className="text-xs sm:text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="rounded-lg bg-white/[0.01] p-4 backdrop-blur-sm dark:bg-black/[0.01]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text:xs font-medium sm:text-sm">
                      Payment
                    </span>
                    <span className="text-base font-semibold sm:text-lg">
                      {EAP_PRICE} SOL
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    Funds will be allocated to cover expenses such as LLM
                    integration, RPC data services, infrastructure maintenance,
                    and other operational costs, all aimed at ensuring the
                    platform&apos;s stability and reliability.
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="https://x.com/neur_sh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                  >
                    <RiTwitterXFill className="mr-2 h-4 w-4" />
                    Follow Updates
                  </Link>
                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="bg-teal-500/70 text-xs ring-offset-0 hover:bg-teal-500/90 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-teal-500/60 dark:hover:bg-teal-500/80 sm:text-sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      `Join EAP (${EAP_PRICE} SOL)`
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
*/
  if (!accessCode || (accessCode && !isValid)) {
    return (
      <div className="relative h-screen w-full overflow-hidden text-xs sm:text-base">
        <div className="absolute inset-0 z-10 bg-background/30 backdrop-blur-md" />
        {mainContent}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="mx-auto max-h-screen max-w-xl overflow-y-auto p-6">
            <Card className="relative max-h-full border-white/[0.1] bg-white/[0.02] p-4 backdrop-blur-sm backdrop-saturate-150 dark:bg-black/[0.02] sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-white/[0.02] dark:from-white/[0.02] dark:to-white/[0.01]" />
              <div className="relative space-y-6">
                <div className="space-y-2 text-center">
                  <h2 className="text-lg font-semibold sm:text-2xl">
                    Early Access Program
                  </h2>
                  <div className="text-muted-foreground">
                    We&apos;re currently limiting <Badge>BETA</Badge> access to
                    a limited amount of users to ensure stable service while
                    continuing to refine features.
                  </div>
                </div>

                <Card className="hidden border-teal-500/10 bg-white/[0.01] p-6 backdrop-blur-sm dark:bg-black/[0.01]">
                  <h3 className="mb-4 font-semibold">EAP Benefits</h3>
                  <div className="space-y-3">
                    {EAP_BENEFITS.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-1 h-4 w-4 text-teal-500" />
                        <span className="text-xs sm:text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="rounded-lg bg-white/[0.01] p-4 backdrop-blur-sm dark:bg-black/[0.01]">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text:xs font-medium sm:text-sm">
                      Enter your access code
                    </span>
                    <span className="hidden text-base font-semibold sm:text-lg">
                      For free
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-sm">
                    <Input
                      placeholder="acb0c250"
                      type="text"
                      value={accessCodeToken}
                      onChange={(e) => setaccessCodeToken(e.target.value)}
                      className="h-11 w-full border"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <Link
                    href="https://t.me/+8T-oqzlITplhMTVk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                  >
                    <RiTelegram2Fill className="mr-2 h-4 w-4" />
                    Follow Updates
                  </Link>
                  <Button
                    onClick={handleSubmitAccessCode}
                    disabled={isProcessing}
                    className="bg-teal-500/70 text-xs ring-offset-0 hover:bg-teal-500/90 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-teal-500/60 dark:hover:bg-teal-500/80 sm:text-sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      `Join Early access`
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      {!showChat && (
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto overflow-x-hidden transition-opacity duration-300 ',
            showChat ? 'pointer-events-none opacity-0' : 'opacity-100',
          )}
        >
          {mainContent}
        </div>
      )}
      {showChat && (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            showChat ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          <ChatInterface id={chatId} initialMessages={messages} />
        </div>
      )}
    </div>
  );
}
function useToast(): { toast: any } {
  throw new Error('Function not implemented.');
}
