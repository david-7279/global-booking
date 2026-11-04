import { Link } from 'react-router'
import { FormLogin } from '@/src/(default)/authentication/ui/components/forms/form-login.tsx'
import { FormRegister } from '@/src/(default)/authentication/ui/components/forms/form-register.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import { Card, CardContent, CardFooter, CardHeader } from '@/src/components/ui/card.tsx'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    TabsTriggerLabel,
} from '@/src/components/ui/tabs.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { paths } from '@/src/router/paths.ts'

export default function AuthenticationPage() {
    return (
        <SafeArea className="items-center justify-center bg-muted/20 px-5 py-10">
            <div className="w-full max-w-xl">
                <Link
                    to={paths.public.root}
                    className="mb-6 block text-center font-heading text-2xl font-semibold tracking-tight"
                >
                    Atlas<span className="text-primary">.</span>
                </Link>
                <Card className="border-border">
                    <CardHeader className="border-b border-border bg-card p-7 sm:p-9">
                        <Text
                            variant="xs"
                            className="font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                        >
                            Área reservada
                        </Text>
                        <h1 className="mt-4 font-heading text-4xl tracking-tight">
                            A sua equipa começa aqui.
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Entre na sua conta ou crie um acesso para continuar.
                        </p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="login" className="flex flex-col items-start">
                                    <TabsTriggerLabel kicker="Opção 01" label="Entrar na conta" />
                                </TabsTrigger>
                                <TabsTrigger value="register" className="flex flex-col items-start">
                                    <TabsTriggerLabel kicker="Opção 02" label="Criar uma conta" />
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="px-7 pb-9 pt-8 sm:px-9">
                                <FormLogin />
                            </TabsContent>
                            <TabsContent value="register" className="px-7 pb-9 pt-8 sm:px-9">
                                <FormRegister />
                                <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                                    Ao criar uma conta, aceita os nossos{' '}
                                    <Link
                                        to={paths.public.terms}
                                        className="underline underline-offset-2 hover:text-foreground"
                                    >
                                        termos de utilização
                                    </Link>{' '}
                                    e a{' '}
                                    <Link
                                        to={paths.public.privacy}
                                        className="underline underline-offset-2 hover:text-foreground"
                                    >
                                        política de privacidade
                                    </Link>
                                    .
                                </p>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="border-t border-border bg-muted/30 p-6">
                        <Text variant="xs" className="text-muted-foreground">
                            Os seus dados são protegidos e utilizados apenas para disponibilizar o
                            serviço.
                        </Text>
                    </CardFooter>
                </Card>
            </div>
        </SafeArea>
    )
}
