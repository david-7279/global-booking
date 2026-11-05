import { useState } from 'react'
import type { CreateBookingRequest } from '@/src/(services)/booking/types/booking.types.ts'
import { Button } from '@/src/components/ui/button.tsx'
import { Field, FieldLabel } from '@/src/components/ui/field.tsx'
import { Input } from '@/src/components/ui/input.tsx'
import { Text } from '@/src/components/ui/text.tsx'
import { Textarea } from '@/src/components/ui/textarea.tsx'

type BookingFormProps = {
    pending?: boolean
    onSubmit: (request: CreateBookingRequest) => void
    onCancel?: () => void
}

const initialValue: CreateBookingRequest = {
    businessId: '',
    establishmentId: '',
    bookingServiceId: '',
    resourceId: '',
    startAt: '',
    endAt: '',
    notes: '',
}

export function BookingForm({ pending = false, onSubmit, onCancel }: BookingFormProps) {
    const [value, setValue] = useState(initialValue)
    const update = (key: keyof CreateBookingRequest, nextValue: string) =>
        setValue((current) => ({ ...current, [key]: nextValue }))
    const isComplete = Object.entries(value).every(
        ([key, fieldValue]) => key === 'notes' || fieldValue.trim().length > 0,
    )

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault()
                if (isComplete) onSubmit(value)
            }}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                {(['businessId', 'establishmentId', 'bookingServiceId', 'resourceId'] as const).map(
                    (field) => (
                        <Field key={field}>
                            <FieldLabel htmlFor={`booking-${field}`}>
                                <Text asChild variant="small">
                                    <span>
                                        {field === 'businessId'
                                            ? 'Business ID'
                                            : field === 'establishmentId'
                                              ? 'Establishment ID'
                                              : field === 'bookingServiceId'
                                                ? 'Service ID'
                                                : 'Resource ID'}
                                    </span>
                                </Text>
                            </FieldLabel>
                            <Input
                                id={`booking-${field}`}
                                value={value[field]}
                                placeholder="UUID"
                                onChange={(event) => update(field, event.target.value)}
                            />
                        </Field>
                    ),
                )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                    <FieldLabel htmlFor="booking-start">
                        <Text asChild variant="small">
                            <span>Início</span>
                        </Text>
                    </FieldLabel>
                    <Input
                        id="booking-start"
                        type="datetime-local"
                        value={value.startAt ? value.startAt.slice(0, 16) : ''}
                        onChange={(event) =>
                            update('startAt', new Date(event.target.value).toISOString())
                        }
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="booking-end">
                        <Text asChild variant="small">
                            <span>Fim</span>
                        </Text>
                    </FieldLabel>
                    <Input
                        id="booking-end"
                        type="datetime-local"
                        value={value.endAt ? value.endAt.slice(0, 16) : ''}
                        onChange={(event) =>
                            update('endAt', new Date(event.target.value).toISOString())
                        }
                    />
                </Field>
            </div>
            <Field>
                <FieldLabel htmlFor="booking-notes">
                    <Text asChild variant="small">
                        <span>Notas</span>
                    </Text>
                </FieldLabel>
                <Textarea
                    id="booking-notes"
                    maxLength={1000}
                    placeholder="Observações opcionais"
                    value={value.notes ?? ''}
                    onChange={(event) => update('notes', event.target.value)}
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
                <Button type="submit" disabled={!isComplete || pending}>
                    <Text asChild variant="small">
                        <span>{pending ? 'A criar…' : 'Criar solicitação'}</span>
                    </Text>
                </Button>
            </div>
        </form>
    )
}
