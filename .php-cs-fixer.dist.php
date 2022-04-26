<?php

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__.'/src')
    ->exclude('var')
;

return (new PhpCsFixer\Config())
    ->setRules([
        '@Symfony' => true,
        '@Symfony:risky' => true,
        'blank_line_after_namespace' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_class_elements' => true,
        'ordered_imports' => true,
        'phpdoc_order' => true,
        'phpdoc_add_missing_param_annotation' => true,
        'phpdoc_single_line_var_spacing' => true,
        'no_useless_else' => true,
        'no_useless_return' => true,
        'strict_param' => true,
        'strict_comparison' => true,
        'self_accessor' => true,
        'single_quote' => true,
        'no_unused_imports' => true,
        'use_arrow_functions' => true,
        'no_leading_import_slash' => true,
        'concat_space' => ['spacing' => 'none'],
        'global_namespace_import' => false,
        'lambda_not_used_import' => true,
        'single_line_after_imports' => true,
        'align_multiline_comment' => true,
        'single_trait_insert_per_statement' => false,
        'single_blank_line_at_eof' => true,
        'single_line_throw' => true,
        'no_extra_blank_lines' => ['tokens' => [
            'extra',
            'break',
            'continue',
            'return',
            'throw',
            'use',
            'parenthesis_brace_block',
            'square_brace_block',
            'curly_brace_block',
        ]],
    ])
    ->setFinder($finder)
;
