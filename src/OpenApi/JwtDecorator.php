<?php

declare(strict_types=1);

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model;
use ApiPlatform\Core\OpenApi\OpenApi;

final class JwtDecorator implements OpenApiFactoryInterface
{
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $schemas = $openApi->getComponents()->getSchemas();

        $schemas['Credentials'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'uuid' => [
                    'type' => 'string',
                    'example' => '152269767',
                ],
                'password' => [
                    'type' => 'string',
                    'example' => 'password',
                ],
            ],
        ]);
        $schemas['InvalidCredentials'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'message' => [
                    'type' => 'string',
                    'example' => 'Identifiants invalides.',
                ],
            ],
        ]);
        $schemas['MissingRefreshToken'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'message' => [
                    'type' => 'string',
                    'example' => 'Missing JWT Refresh Token',
                ],
            ],
        ]);
        $schemas['InvalidateRefreshToken'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'message' => [
                    'type' => 'string',
                    'example' => 'The supplied refresh_token has been invalidated.',
                ],
            ],
        ]);

        $jwtLogin = new Model\PathItem(
            ref: 'JWT Login',
            post: new Model\Operation(
                operationId: 'authenticate',
                tags: ['Token'],
                responses: [
                    '200' => [
                        'description' => 'Get a HttpOnly cookie containing the JWT to authenticate. Returns the user\'s API fields.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/User',
                                ],
                            ],
                        ],
                    ],
                    '401' => [
                        'description' => 'The credentials are invalid.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/InvalidCredentials',
                                ],
                            ],
                        ],
                    ],
                ],
                summary: 'Sets the JWT to authenticate the user as a HttpOnly cookie. Returns the user\'s API fields.',
                requestBody: new Model\RequestBody(
                    description: 'Generate a JWT to authenticate the user.',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Credentials',
                            ],
                        ],
                    ]),
                ),
            ),
        );

        $jwtRefresh = new Model\PathItem(
            ref: 'JWT Refresh',
            post: new Model\Operation(
                operationId: 'refresh',
                tags: ['Token'],
                responses: [
                    '200' => [
                        'description' => 'Refreshes the user\'s JWT and JWT Refresh Token. Returns the user\'s api fields.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/User',
                                ],
                            ],
                        ],
                    ],
                    '401' => [
                        'description' => 'The JWT Refresh Token is missing or invalid.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/MissingRefreshToken',
                                ],
                            ],
                        ],
                    ],
                ],
                summary: 'Refreshes the user\'s JWT. The refresh token is returned as a HttpOnly cookie and is a one time use token. Returns the user\'s API fields. If the user is missing a JWT but has a valid Refresh Token, the JWT will be generated and set as a HttpOnly cookie.',
                requestBody: new Model\RequestBody(
                    description: 'Refresh the user\'s JWT. Requires the user\'s JWT Refresh Token cookie to be set.',
                ),
            ),
        );

        $jwtInvalidate = new Model\PathItem(
            ref: 'JWT Invalidate',
            post: new Model\Operation(
                operationId: 'invalidate',
                tags: ['Token'],
                responses: [
                    '200' => [
                        'description' => 'Removes the user\'s HttpOnly JWT cookie and JWT Refresh Token cookie, and invalidates the JWT Refresh Token.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/InvalidateRefreshToken',
                                ],
                            ],
                        ],
                    ],
                    '401' => [
                        'description' => 'The JWT Refresh Token is missing or invalid.',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/MissingRefreshToken',
                                ],
                            ],
                        ],
                    ],
                ],
                summary: 'Removes the user\'s HttpOnly JWT cookie and Token cookie, and invalidates the JWT Refresh Token. If the JWT Refresh Token is missing or invalid, the JWT cookie will still be removed.',
                requestBody: new Model\RequestBody(
                    description: 'Invalidate the user\'s JWT Refresh Token. Requires the user\'s JWT Refresh Token cookie to be set.',
                ),
            ),
        );

        $openApi->getPaths()->addPath('/api/auth-token', $jwtLogin);
        $openApi->getPaths()->addPath('/api/refresh-token', $jwtRefresh);
        $openApi->getPaths()->addPath('/api/invalidate-token', $jwtInvalidate);

        return $openApi;
    }
}
