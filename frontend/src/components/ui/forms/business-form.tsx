import { useState } from 'react'
import type { BusinessRequest } from '@/src/(services)/business/types/business.types.ts'
import { Button } from '@/src/components/ui/button.tsx'
import { Field, FieldLabel } from '@/src/components/ui/field.tsx'
import { Input } from '@/src/components/ui/input.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { Textarea } from '@/src/components/ui/textarea.tsx'

type BusinessFormProps = {
    initialValue?: BusinessRequest
    pending?: boolean
    onSubmit: (value: BusinessRequest) => void
    onCancel?: () => void
}

export function BusinessForm({
    initialValue,
    pending = false,
    onSubmit,
    onCancel,
}: BusinessFormProps) {
    const [value, setValue] = useState<BusinessRequest>(
        initialValue ?? { name: '', description: '' },
    )
    const canSubmit = value.name.trim().length > 0

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault()
                if (canSubmit)
                    onSubmit({ name: value.name.trim(), description: value.description?.trim() })
            }}
        >
            <Field>
                <FieldLabel htmlFor="business-name">
                    <Text asChild variant="small">
                        <span>Nome do negócio</span>
                    </Text>
                </FieldLabel>
                <Input
                    id="business-name"
                    value={value.name}
                    maxLength={160}
                    placeholder="Ex.: Estúdio Aurora"
                    onChange={(event) =>
                        setValue((current) => ({ ...current, name: event.target.value }))
                    }
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="business-description">
                    <Text asChild variant="small">
                        <span>Descrição</span>
                    </Text>
                </FieldLabel>
                <Textarea
                    id="business-description"
                    value={value.description ?? ''}
                    maxLength={1000}
                    placeholder="Uma breve descrição da operação"
                    onChange={(event) =>
                        setValue((current) => ({ ...current, description: event.target.value }))
                    }
                />
            </Field>
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        <Text asChild variant="small">
                            <span>Cancelar</span>
                        </Text>
                    </Button>
                )}
                <Button type="submit" disabled={!canSubmit || pending}>
                    <Text asChild variant="small">
                        <span>{pending ? 'A guardar…' : 'Guardar negócio'}</span>
                    </Text>
                </Button>
            </div>
        </form>
    )
}
